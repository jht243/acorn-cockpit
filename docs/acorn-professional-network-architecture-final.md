# Acorn Care — Professional Network Module
## Final Build Architecture — v1 ($3,000 Fixed Fee)

**Prepared by:** Layer 3 Consulting Inc.
**For:** Jonathan (build spec) / Pat (scope reference)
**Status:** Final — ready for development
**Revision note:** This consolidates the original architecture with a security review (via ChatGPT/Codex). Real bugs and privacy risks from that review are adopted as non-negotiable. Scope additions that overbuilt for a single-admin, ~50–200 contact system were simplified or cut. Rationale for every cut is documented inline so nothing is lost — it's deferred, not forgotten.

---

## 1. Product Summary

A private, internal Acorn Cockpit module that helps Karli manage her professional referral network (estate attorneys, CPAs, elder law, insurance, financial advisors, etc.) and get matched suggestions when a client needs a specific kind of help.

Two distinct ways matches happen:

1. **Manual search** — Karli types a need ("divorce attorney near Boca who's still taking clients") and gets ranked results.
2. **Automatic suggestion from intake data** — when a client's intake responses indicate a need (location, plan tier, flagged situations like "no POA on file" or "estate plan incomplete"), the system proactively surfaces matching contacts on that client's profile without Karli having to search at all.

This is not a public referral marketplace, not client-facing, not a compliance platform, and not an advice engine. It is a private memory and matching tool for one practitioner's trusted network.

---

## 2. Architecture Decision: Integrated, with a Clean Extraction Seam

Build inside the existing Acorn Cockpit (shared Supabase, Next.js, Render, auth). The value depends on reading existing client data (location, plan tier, intake responses) — that only works if it's in the same system.

**Future extraction seam (cheap to do now, expensive to retrofit later):** every new table gets a `workspace_id` column, defaulting to a single static UUID representing "Acorn Care." This costs almost nothing to add now and means that if this becomes a multi-tenant product later, the core tables don't need restructuring — only a real `workspaces`/membership table needs to be added on top.

**What we are explicitly NOT building in v1:** a `workspace_members` table, roles, or any multi-tenant membership logic. That's real engineering for a problem that doesn't exist yet — there is one admin user (Karli). Adding `workspace_id` as a column is nearly free; building permission infrastructure around it is not, and would be scope creep beyond $3K.

```
Professional Network Core (extractable later)
  professional_contacts
  professional_contact_notes
  sub_contacts
  professional_tags
  professional_contact_tags
  contact_search_documents

Acorn Integration Layer (stays Acorn-specific)
  client_intro_log
  suggested-matches query logic
  client profile UI integration
```

---

## 3. Non-Negotiable Security Fixes (adopted from review)

These three issues were real bugs or privacy risks in the original draft. They are adopted in full regardless of budget — they don't meaningfully add build time, and getting them wrong has real consequences given who Karli's clients are.

### 3.1 `accepting_status` defaults to `unknown`, never `true`

The original draft defaulted new contacts to "accepting new clients." That's backwards — it would let Karli refer a client to someone who actually stopped taking clients months ago, with no warning. Every new contact starts as `unknown` until she actively confirms status.

### 3.2 Client-specific facts never enter the global professional search index

Notes about a *professional* ("patient with elderly clients, good at explaining trusts") are searchable. Notes about a *client situation* tied to a referral ("helped after Robert's dementia diagnosis") must live only in `client_intro_log`, scoped to that client record, and must never be indexed into the general contact search. This is a real data-leakage risk: if it's in the searchable text, any future search could surface a sensitive client fact out of context. This is a hard product rule, enforced at the schema level (separate tables, separate search inclusion).

### 3.3 Search index is a separate table, not a generated column on `contacts`

A `tsvector` generated column on `professional_contacts` can't aggregate text from a child table (`contact_notes`) — Postgres generated columns don't support cross-table aggregation. The original plan would not have worked as specified. Use a separate `contact_search_documents` table, refreshed by application code after relevant writes.

---

## 4. Adopted-but-Simplified Changes

These ideas from the review are directionally correct but were scoped heavier than this build needs. Right-sized versions below.

| Review's version | What we're doing instead | Why |
|---|---|---|
| Full `workspaces` + `workspace_members` + roles | `workspace_id` column only, hardcoded to one workspace | Gets the extraction benefit at near-zero cost; full membership/roles system is solving a problem that doesn't exist with one user |
| `professional_contact_relationships` (self-referencing, typed, extensible) | `sub_contacts` (simple child table) | Solves exactly what Karli asked for — assistant/secretary with their own name/phone — without a more complex self-referencing model. Revisit only if a "promote sub-contact to full contact" need actually comes up |
| Full `professional_import_batches` + `professional_import_rows` with per-row state machine | In-memory parse → preview screen → confirm → direct write | Same user-facing experience (preview before commit, duplicate detection) without persisting two new tables and row-level state tracking for what's essentially a one-time bulk action |
| Full `audit_log` table with before/after JSON, IP, user agent | `created_by` / `updated_by` columns + timestamps on each table | Answers "who did what when" for a single-admin system without building a compliance-grade audit trail for a problem (multi-user accountability) that doesn't exist yet |
| `professional_tags` as fully separate controlled-vocabulary table with category enum | Adopted as-is — see Section 5 | This one's worth keeping at full strength; tag drift ("elder_law" vs "elderlaw" vs "elder law") is a real near-term problem at any contact volume, and the lift to do it right is small |

---

## 5. Data Model

### `professional_contacts`
Primary professional record.

```sql
create table professional_contacts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null default '00000000-0000-0000-0000-000000000001',

  full_name text not null,
  firm_name text,
  title text,

  email text,
  phone text,

  city text,
  region text,        -- county / metro area, used for proximity matching
  state_province text default 'FL',

  accepting_status text not null default 'unknown'
    check (accepting_status in ('unknown', 'accepting', 'limited', 'not_accepting')),
  accepting_status_verified_at timestamptz,

  relationship_strength text not null default 'unknown'
    check (relationship_strength in ('unknown', 'cold', 'warm', 'strong')),

  do_not_refer boolean not null default false,
  do_not_refer_reason text,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  archived_at timestamptz,
  deleted_at timestamptz
);
```

### `professional_contact_notes`
Notes about the professional. Never client-specific (see Section 3.2).

```sql
create table professional_contact_notes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null default '00000000-0000-0000-0000-000000000001',
  contact_id uuid not null references professional_contacts(id) on delete cascade,

  note_text text not null,
  include_in_search boolean not null default true,

  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

### `sub_contacts`
The "I spoke to the secretary, not the attorney" case.

```sql
create table sub_contacts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null default '00000000-0000-0000-0000-000000000001',
  parent_contact_id uuid not null references professional_contacts(id) on delete cascade,

  full_name text not null,
  role text,           -- "Assistant", "Paralegal", "Office Manager"
  phone text,
  email text,
  notes text,

  created_at timestamptz not null default now()
);
```

### `professional_tags`
Controlled vocabulary — adopted at full strength from the review.

```sql
create table professional_tags (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null default '00000000-0000-0000-0000-000000000001',

  slug text not null,
  label text not null,
  category text not null check (
    category in ('profession', 'specialty', 'client_situation', 'language', 'working_style')
  ),

  created_at timestamptz not null default now(),
  archived_at timestamptz,

  unique (workspace_id, slug)
);
```

### `professional_contact_tags`
Join table — prevents tag drift ("elder_law" vs "elderlaw" vs "elder law").

```sql
create table professional_contact_tags (
  contact_id uuid not null references professional_contacts(id) on delete cascade,
  tag_id uuid not null references professional_tags(id) on delete cascade,
  created_at timestamptz not null default now(),

  primary key (contact_id, tag_id)
);
```

### `contact_search_documents`
Durable, separately-maintained search index (see Section 3.3).

```sql
create table contact_search_documents (
  contact_id uuid primary key references professional_contacts(id) on delete cascade,
  workspace_id uuid not null default '00000000-0000-0000-0000-000000000001',

  search_text text not null,
  search_vector tsvector,
  updated_at timestamptz not null default now()
);

create index idx_search_vector on contact_search_documents using gin (search_vector);
```

Refreshed by application code after any write to a contact, its notes, or its tags — not by SQL trigger, for simplicity and easier debugging at this scale.

**Search text includes:** name, firm, title, city/region, tag labels, notes where `include_in_search = true`, sub-contact names.
**Search text excludes:** anything from `client_intro_log`, client names, client situation specifics.

### `client_intro_log`
Acorn-specific bridge to the existing `clients` table. This is where client-specific referral context lives — kept separate from the searchable professional notes by design.

```sql
create table client_intro_log (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null default '00000000-0000-0000-0000-000000000001',

  client_id uuid not null references clients(id) on delete restrict,
  contact_id uuid not null references professional_contacts(id) on delete restrict,

  intro_date timestamptz not null default now(),
  status text not null default 'introduced'
    check (status in ('introduced', 'scheduled', 'engaged', 'no_match', 'declined')),

  referral_reason text,      -- why this match was made (e.g. "needs estate attorney, Boca, accepting")
  outcome_notes text,        -- client-specific — never indexed into global search

  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

---

## 6. Indexes (minimum set for this scale)

```sql
create index idx_contacts_workspace on professional_contacts (workspace_id) where deleted_at is null;
create index idx_contacts_region on professional_contacts (workspace_id, region);
create index idx_contacts_accepting on professional_contacts (workspace_id, accepting_status);
create index idx_contacts_do_not_refer on professional_contacts (workspace_id, do_not_refer);

create index idx_notes_contact on professional_contact_notes (contact_id) where deleted_at is null;
create index idx_subcontacts_parent on sub_contacts (parent_contact_id);

create index idx_contact_tags_contact on professional_contact_tags (contact_id);
create index idx_contact_tags_tag on professional_contact_tags (tag_id);

create index idx_intro_log_client on client_intro_log (client_id) where deleted_at is null;
create index idx_intro_log_contact on client_intro_log (contact_id) where deleted_at is null;
```

---

## 7. Search Architecture (v1 — no AI, no pgvector)

Appropriate at this scale (50–200 contacts). Postgres full-text search via `tsvector`/`tsquery`, using `websearch_to_tsquery` (handles natural phrasing better than raw `to_tsquery`) for the manual search bar.

**Ranking, in order:**
1. Tag match to required profession/specialty
2. Location/region match to client
3. `accepting_status`: accepting > limited > unknown > not_accepting (never surface `not_accepting` in suggestions; `do_not_refer = true` is excluded entirely, always)
4. `relationship_strength`: strong > warm > cold > unknown
5. Text relevance
6. Prior successful intro history with this contact

**Phase 2 (not in this scope, real upsell later):** pgvector + embeddings for true natural-language matching ("someone good with a blended family going through a business sale"). Quote separately once Karli's used structured search for a few weeks and the tag/note data has real volume — semantic search is only meaningfully better than keyword search once there's enough text to differentiate on.

---

## 8. Suggested Matches From Intake Data (explicit spec — this was implicit before, now made concrete)

This is the automatic half of the matching system, distinct from manual search, and it's a core piece of why this is valuable to Karli.

**Trigger:** whenever a client's intake responses or profile contain certain fields, the system runs the matching logic automatically and surfaces results on that client's profile page — no search action required from Karli.

**Inputs read from the existing client record:**
- Location (city/region) — already captured at intake
- Plan tier (Royal Oak / Sycamore / Mahogany) — already captured
- Flagged needs — this requires intake to capture structured need-flags, not just free text. If intake doesn't already produce these, add a small intake step or admin-side tagging: e.g. checkboxes or system-detected flags like "no POA on file," "no estate attorney listed," "insurance not reviewed," "no CPA relationship"

**Matching logic:**
```
client.region          → filter contacts by region/proximity
client.flagged_needs    → map to profession_tags
                           (e.g. "no POA on file" → estate_attorney, elder_law)
contact.accepting_status → exclude not_accepting, deprioritize unknown
contact.do_not_refer     → always excluded
→ ranked list of suggested contacts, same ranking logic as manual search
```

**Output shown on client profile:**
- Contact name, firm, matched tags, location, accepting status + last verified date, relationship strength
- A plain-language reason: *"Suggested because: estate attorney + elder law tag, located in Coral Gables, accepting status verified 12 days ago, strong relationship."*
- Always framed as **"Suggested contacts to review"** — never "best match," "recommended attorney," or anything implying automated advice. Karli reviews and decides; the system doesn't decide for her.

**Where this lives in build scope:** this reuses the exact same search/ranking engine from Section 7, just triggered by client-record changes instead of a manual query, plus the UI surface on the client profile page (already prototyped in the demo). It is not a separate system — it's the same matching logic with a different trigger and a different display location. This was always implicit in scope but is now made explicit so nothing gets missed in the build.

---

## 9. Row Level Security

Since this is single-admin today, RLS is simpler than a multi-tenant system but still required — no new table should ever be readable by anonymous/unauthenticated requests, and service-role keys must stay server-side only.

```sql
alter table professional_contacts enable row level security;

create policy "authenticated users can read contacts"
on professional_contacts for select
to authenticated
using (true);  -- single workspace today; tighten to workspace_id check if/when multi-user

create policy "authenticated users can write contacts"
on professional_contacts for insert
to authenticated
with check (true);

create policy "authenticated users can update contacts"
on professional_contacts for update
to authenticated
using (true) with check (true);
```

Apply the same pattern (enable RLS, authenticated-only policies) to every new table: `professional_contact_notes`, `sub_contacts`, `professional_tags`, `professional_contact_tags`, `contact_search_documents`, `client_intro_log`.

**`client_intro_log` gets one extra consideration:** since it bridges to the real `clients` table, its access should follow whatever RLS pattern already protects `clients` — if Karli is the only admin today this is straightforward, but don't create a policy on `client_intro_log` that's more permissive than the policy already protecting `clients` itself.

Delete operations should be restricted or disabled at the policy level — use `archived_at`/`deleted_at` (Section 10) instead of allowing hard deletes through the API.

---

## 10. Soft Deletes

Use `archived_at` for routine hiding (e.g. Karli marks a contact inactive) and `deleted_at` for actual removal requests. Hard `DELETE` should not be exposed through normal app routes — if a true hard delete is ever needed, do it directly in Supabase, same as the existing client-deletion pattern already documented in the Cockpit handoff doc.

Search must never return soft-deleted or archived contacts. Suggested matches must never return `do_not_refer = true` contacts, regardless of soft-delete status.

---

## 11. Import Flow (simplified from the review's batch/row system)

In-memory preview, not persisted batch tracking — same user experience, less infrastructure:

1. Upload CSV or vCard
2. Parse in memory, run duplicate detection against existing `professional_contacts` (match on name + phone or email similarity)
3. Show preview screen: new contacts, flagged duplicates side-by-side (keep existing / keep new / merge)
4. Bulk tag assignment on the preview screen before commit
5. On confirm, write directly to `professional_contacts` + `professional_contact_tags` + refresh `contact_search_documents`
6. Show a simple results summary (X imported, Y duplicates resolved, Z tagged)

No `import_batches`/`import_rows` tables needed for this volume — if Karli is bulk-importing rarely (initial setup, maybe once or twice a year after that), persisting import history isn't worth the schema overhead. If usage patterns later show frequent re-imports needing audit history, this is a cheap add at that point.

File handling: enforce file size limit, restrict to `.csv`/`.vcf`, sanitize fields on parse to prevent CSV formula-injection on any future export.

---

## 12. API Routes

```
GET    /professional-network/contacts
POST   /professional-network/contacts
GET    /professional-network/contacts/:id
PATCH  /professional-network/contacts/:id
POST   /professional-network/contacts/:id/archive

POST   /professional-network/contacts/:id/notes
PATCH  /professional-network/notes/:id

POST   /professional-network/contacts/:id/tags
DELETE /professional-network/contacts/:id/tags/:tagId

POST   /professional-network/contacts/:id/sub-contacts
PATCH  /professional-network/sub-contacts/:id

GET    /professional-network/search
GET    /professional-network/clients/:clientId/suggested-matches

POST   /professional-network/clients/:clientId/intro-log
PATCH  /professional-network/intro-log/:id

POST   /professional-network/import/preview
POST   /professional-network/import/commit
```

Every write route: verify auth session → validate payload → write → refresh `contact_search_documents` if relevant.

---

## 13. UI Surfaces (already prototyped in demo, mapped to schema)

1. **Professional Network table** — search bar, filters (profession, location, accepting status, relationship strength), quick add
2. **Contact detail view** — profile, tags, notes history, sub-contacts, full intro history across all clients
3. **Suggested Professionals (client profile)** — auto-surfaced matches with "why suggested" explanation, "Log Intro Made" action
4. **Import flow** — upload → duplicate review → bulk tag → commit → results summary

---

## 14. Explicit v1 Exclusions

```
Multi-user roles/permissions (single admin only)
Full audit log with before/after snapshots
Persisted import batch/row history
Semantic/AI-powered search (pgvector)
Public referral form
Automated email check-ins to verify accepting_status
Client-facing professional recommendations
Multi-tenant SaaS infrastructure
```

These are not rejected ideas — they're correctly deferred. Revisit if/when: a second admin user is added (roles), compliance requirements emerge (full audit), import frequency increases significantly (batch history), or there's a second paying customer for a standalone product (multi-tenant, semantic search).

---

## 15. Acceptance Criteria

```
- All schema in migration files, not manual Supabase dashboard edits
- RLS enabled on every new table, no anonymous access
- Service-role key never exposed client-side
- Contact CRUD works (create, edit, archive)
- Notes history works, client-specific facts never appear in professional notes
- Tags work via controlled vocabulary, no free-text drift
- Sub-contacts work (assistant/secretary case)
- Manual search returns ranked, relevant results
- Suggested matches auto-populate on client profile from intake data
- "Why suggested" explanation shown on every suggested match
- Intro log works and is excluded from global search
- Import preview/duplicate detection/bulk tag/commit flow works end to end
- Archived/deleted contacts never appear in search or suggestions
- do_not_refer contacts never appear in suggested matches
- accepting_status defaults to unknown on all new contacts
```

---

## 16. Build Sequence

1. **Schema + RLS** — tables, constraints, indexes, RLS policies, seed initial tags
2. **Contact CRUD** — network table, quick add, detail view, edit/archive
3. **Tags + Notes + Sub-contacts** — tagging UI, notes history, search-inclusion toggle
4. **Search** — `contact_search_documents` refresh logic, manual search bar, filters, ranking
5. **Client Integration** — suggested matches engine reading intake data, "why suggested," intro log
6. **Import** — preview, duplicate detection, bulk tagging, commit
7. **Final pass** — RLS verification (no anon access, service-role server-only), staging test before production migration

---

## 17. Path to Standalone Product (reference only, not part of this build)

If this proves valuable beyond Karli: add a real `workspace_members`/roles table on top of the existing `workspace_id` columns (already in place from day one), build a generalized onboarding/import flow, and revisit semantic search as a differentiator once there's real multi-customer data to refine against. The schema in this doc was deliberately designed so that step is additive, not a rewrite — but do not build toward it now.

-- ============================================================
-- Stage 1: Professional Network — schema, indexes, RLS, seed tags
-- Target: staging (twdojpfpblqokydnleqx.supabase.co)
-- DO NOT apply to production until staging is signed off.
-- ============================================================

-- Minimal clients stub so the FK in client_intro_log resolves in staging.
-- In production the real clients table already exists — this is a no-op there.
create table if not exists clients (
  id uuid primary key default gen_random_uuid()
);

-- ============================================================
-- TABLES
-- ============================================================

create table professional_contacts (
  id                            uuid primary key default gen_random_uuid(),
  workspace_id                  uuid not null default '00000000-0000-0000-0000-000000000001',

  full_name                     text not null,
  firm_name                     text,
  title                         text,

  email                         text,
  phone                         text,

  city                          text,
  region                        text,        -- county / metro area, used for proximity matching
  state_province                text default 'FL',

  accepting_status              text not null default 'unknown'
    check (accepting_status in ('unknown', 'accepting', 'limited', 'not_accepting')),
  accepting_status_verified_at  timestamptz,

  relationship_strength         text not null default 'unknown'
    check (relationship_strength in ('unknown', 'cold', 'warm', 'strong')),

  do_not_refer                  boolean not null default false,
  do_not_refer_reason           text,

  created_by                    uuid references auth.users(id),
  updated_by                    uuid references auth.users(id),
  created_at                    timestamptz not null default now(),
  updated_at                    timestamptz not null default now(),

  archived_at                   timestamptz,
  deleted_at                    timestamptz
);

create table professional_contact_notes (
  id              uuid primary key default gen_random_uuid(),
  workspace_id    uuid not null default '00000000-0000-0000-0000-000000000001',
  contact_id      uuid not null references professional_contacts(id) on delete cascade,

  note_text       text not null,
  include_in_search boolean not null default true,  -- false = private note, excluded from search index

  created_by      uuid references auth.users(id),
  created_at      timestamptz not null default now(),
  deleted_at      timestamptz
);

create table sub_contacts (
  id                uuid primary key default gen_random_uuid(),
  workspace_id      uuid not null default '00000000-0000-0000-0000-000000000001',
  parent_contact_id uuid not null references professional_contacts(id) on delete cascade,

  full_name         text not null,
  role              text,     -- e.g. "Assistant", "Paralegal", "Office Manager"
  phone             text,
  email             text,
  notes             text,

  created_at        timestamptz not null default now()
);

create table professional_tags (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null default '00000000-0000-0000-0000-000000000001',

  slug          text not null,
  label         text not null,
  category      text not null check (
    category in ('profession', 'specialty', 'client_situation', 'language', 'working_style')
  ),

  created_at    timestamptz not null default now(),
  archived_at   timestamptz,

  unique (workspace_id, slug)
);

create table professional_contact_tags (
  contact_id  uuid not null references professional_contacts(id) on delete cascade,
  tag_id      uuid not null references professional_tags(id) on delete cascade,
  created_at  timestamptz not null default now(),

  primary key (contact_id, tag_id)
);

-- Separately-maintained full-text search index (see architecture Section 3.3).
-- Refreshed by application code after writes to contacts, notes, or tags.
-- Client-specific facts from client_intro_log are never included here.
create table contact_search_documents (
  contact_id    uuid primary key references professional_contacts(id) on delete cascade,
  workspace_id  uuid not null default '00000000-0000-0000-0000-000000000001',

  search_text   text not null,
  search_vector tsvector,
  updated_at    timestamptz not null default now()
);

-- Bridges professional contacts to the existing clients table.
-- Client-specific referral context lives here only — never indexed into global search.
create table client_intro_log (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null default '00000000-0000-0000-0000-000000000001',

  client_id     uuid not null references clients(id) on delete restrict,
  contact_id    uuid not null references professional_contacts(id) on delete restrict,

  intro_date    timestamptz not null default now(),
  status        text not null default 'introduced'
    check (status in ('introduced', 'scheduled', 'engaged', 'no_match', 'declined')),

  referral_reason   text,   -- why this match was made
  outcome_notes     text,   -- client-specific context — never indexed into global search

  created_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_contacts_workspace    on professional_contacts (workspace_id) where deleted_at is null;
create index idx_contacts_region       on professional_contacts (workspace_id, region);
create index idx_contacts_accepting    on professional_contacts (workspace_id, accepting_status);
create index idx_contacts_do_not_refer on professional_contacts (workspace_id, do_not_refer);

create index idx_notes_contact         on professional_contact_notes (contact_id) where deleted_at is null;
create index idx_subcontacts_parent    on sub_contacts (parent_contact_id);

create index idx_contact_tags_contact  on professional_contact_tags (contact_id);
create index idx_contact_tags_tag      on professional_contact_tags (tag_id);

create index idx_search_vector         on contact_search_documents using gin (search_vector);

create index idx_intro_log_client      on client_intro_log (client_id) where deleted_at is null;
create index idx_intro_log_contact     on client_intro_log (contact_id) where deleted_at is null;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- professional_contacts
alter table professional_contacts enable row level security;

create policy "authenticated users can read contacts"
  on professional_contacts for select to authenticated using (true);

create policy "authenticated users can insert contacts"
  on professional_contacts for insert to authenticated with check (true);

create policy "authenticated users can update contacts"
  on professional_contacts for update to authenticated using (true) with check (true);

-- professional_contact_notes
alter table professional_contact_notes enable row level security;

create policy "authenticated users can read notes"
  on professional_contact_notes for select to authenticated using (true);

create policy "authenticated users can insert notes"
  on professional_contact_notes for insert to authenticated with check (true);

create policy "authenticated users can update notes"
  on professional_contact_notes for update to authenticated using (true) with check (true);

-- sub_contacts
alter table sub_contacts enable row level security;

create policy "authenticated users can read sub_contacts"
  on sub_contacts for select to authenticated using (true);

create policy "authenticated users can insert sub_contacts"
  on sub_contacts for insert to authenticated with check (true);

create policy "authenticated users can update sub_contacts"
  on sub_contacts for update to authenticated using (true) with check (true);

-- professional_tags
alter table professional_tags enable row level security;

create policy "authenticated users can read tags"
  on professional_tags for select to authenticated using (true);

create policy "authenticated users can insert tags"
  on professional_tags for insert to authenticated with check (true);

create policy "authenticated users can update tags"
  on professional_tags for update to authenticated using (true) with check (true);

-- professional_contact_tags
alter table professional_contact_tags enable row level security;

create policy "authenticated users can read contact_tags"
  on professional_contact_tags for select to authenticated using (true);

create policy "authenticated users can insert contact_tags"
  on professional_contact_tags for insert to authenticated with check (true);

create policy "authenticated users can delete contact_tags"
  on professional_contact_tags for delete to authenticated using (true);

-- contact_search_documents
alter table contact_search_documents enable row level security;

create policy "authenticated users can read search_documents"
  on contact_search_documents for select to authenticated using (true);

create policy "authenticated users can insert search_documents"
  on contact_search_documents for insert to authenticated with check (true);

create policy "authenticated users can update search_documents"
  on contact_search_documents for update to authenticated using (true) with check (true);

-- client_intro_log
alter table client_intro_log enable row level security;

create policy "authenticated users can read intro_log"
  on client_intro_log for select to authenticated using (true);

create policy "authenticated users can insert intro_log"
  on client_intro_log for insert to authenticated with check (true);

create policy "authenticated users can update intro_log"
  on client_intro_log for update to authenticated using (true) with check (true);

-- ============================================================
-- SEED: INITIAL TAGS
-- ============================================================

insert into professional_tags (workspace_id, slug, label, category) values
  -- Profession
  ('00000000-0000-0000-0000-000000000001', 'estate_attorney',       'Estate Attorney',        'profession'),
  ('00000000-0000-0000-0000-000000000001', 'elder_law_attorney',    'Elder Law Attorney',     'profession'),
  ('00000000-0000-0000-0000-000000000001', 'cpa',                   'CPA',                    'profession'),
  ('00000000-0000-0000-0000-000000000001', 'financial_advisor',     'Financial Advisor',      'profession'),
  ('00000000-0000-0000-0000-000000000001', 'insurance_agent',       'Insurance Agent',        'profession'),
  ('00000000-0000-0000-0000-000000000001', 'geriatric_care_manager','Geriatric Care Manager', 'profession'),
  ('00000000-0000-0000-0000-000000000001', 'social_worker',         'Social Worker',          'profession'),

  -- Specialty
  ('00000000-0000-0000-0000-000000000001', 'medicaid_planning',     'Medicaid Planning',      'specialty'),
  ('00000000-0000-0000-0000-000000000001', 'special_needs_trusts',  'Special Needs Trusts',   'specialty'),
  ('00000000-0000-0000-0000-000000000001', 'veterans_benefits',     'Veterans Benefits',      'specialty'),
  ('00000000-0000-0000-0000-000000000001', 'long_term_care',        'Long-Term Care',         'specialty'),
  ('00000000-0000-0000-0000-000000000001', 'guardianship',          'Guardianship',           'specialty'),
  ('00000000-0000-0000-0000-000000000001', 'probate',               'Probate',                'specialty'),

  -- Client situation
  ('00000000-0000-0000-0000-000000000001', 'no_poa',                'No POA on File',         'client_situation'),
  ('00000000-0000-0000-0000-000000000001', 'no_healthcare_proxy',   'No Healthcare Proxy',    'client_situation'),
  ('00000000-0000-0000-0000-000000000001', 'no_estate_plan',        'No Estate Plan',         'client_situation'),
  ('00000000-0000-0000-0000-000000000001', 'estate_plan_incomplete','Estate Plan Incomplete',  'client_situation'),
  ('00000000-0000-0000-0000-000000000001', 'no_cpa',                'No CPA Relationship',    'client_situation'),
  ('00000000-0000-0000-0000-000000000001', 'no_financial_advisor',  'No Financial Advisor',   'client_situation'),

  -- Language
  ('00000000-0000-0000-0000-000000000001', 'spanish',               'Spanish',                'language'),
  ('00000000-0000-0000-0000-000000000001', 'portuguese',            'Portuguese',             'language'),
  ('00000000-0000-0000-0000-000000000001', 'haitian_creole',        'Haitian Creole',         'language'),

  -- Working style
  ('00000000-0000-0000-0000-000000000001', 'patient_with_elderly',  'Patient with Elderly Clients', 'working_style'),
  ('00000000-0000-0000-0000-000000000001', 'virtual_friendly',      'Virtual-Friendly',             'working_style'),
  ('00000000-0000-0000-0000-000000000001', 'takes_urgent_cases',    'Takes Urgent Cases',           'working_style'),
  ('00000000-0000-0000-0000-000000000001', 'good_communicator',     'Good Communicator',            'working_style');

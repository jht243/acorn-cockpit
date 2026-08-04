-- Extended client profile data sourced from eMoney "complete profile" reports.
-- Purely additive: new tables + new nullable columns on `assets`. Nothing existing
-- is altered or dropped, so the current dashboard UX is unaffected. The dashboard
-- surfaces this in a collapsible "More info" section only.
--
-- Domains: insurance policies, estate & legal documents, beneficiary designations,
-- household members, and richer account metadata on assets.

-- ─────────────────────────────────────────────────────────────
-- 1. Insurance policies
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.insurance_policies (
  id                uuid        NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id         uuid        NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  policy_type       text        NOT NULL,           -- Life | Long-Term Care | Disability | Business Disability | Property/Casualty | Medical | Other
  name              text,                            -- e.g. "AIG Term Policy"
  carrier           text,                            -- issuing institution
  insured           text,
  owner             text,
  coverage_amount   numeric,                          -- death benefit / coverage limit
  annual_premium    numeric,
  cash_value        numeric,
  policy_number     text,
  renewal_date      date,
  beneficiary_summary text,                           -- freeform; structured rows live in `beneficiaries`
  notes             text,
  source            text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS insurance_policies_client_id_idx ON public.insurance_policies(client_id);

-- ─────────────────────────────────────────────────────────────
-- 2. Estate & legal documents
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.estate_documents (
  id            uuid        NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id     uuid        NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  doc_type      text        NOT NULL,               -- Will | Revocable Trust | Irrevocable Trust | Financial POA | Healthcare Directive | Beneficiary Designations | Other
  in_place      boolean     NOT NULL DEFAULT false, -- does the client have this document?
  doc_date      date,                                -- date executed / last updated
  location      text,                                -- where it is stored
  fiduciary     text,                                -- executor / trustee / agent
  notes         text,
  source        text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS estate_documents_client_id_idx ON public.estate_documents(client_id);

-- ─────────────────────────────────────────────────────────────
-- 3. Beneficiary designations (per account or per policy)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.beneficiaries (
  id                uuid        NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id         uuid        NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  applies_to        text        NOT NULL,           -- "Anita IRA" | "AIG Term Policy"
  applies_to_type   text,                            -- account | policy
  designation       text        NOT NULL,           -- Primary | Contingent | Second Death
  beneficiary       text        NOT NULL,           -- "Equally to Children" | "Other Heirs"
  share_pct         numeric,
  notes             text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS beneficiaries_client_id_idx ON public.beneficiaries(client_id);

-- ─────────────────────────────────────────────────────────────
-- 4. Household members (spouse, children, dependents)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.household_members (
  id              uuid        NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id       uuid        NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name            text        NOT NULL,
  relationship    text,                              -- Spouse | Son | Daughter | Dependent | Grandchild | Parent | Other
  date_of_birth   date,
  is_dependent    boolean     DEFAULT false,
  notes           text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS household_members_client_id_idx ON public.household_members(client_id);

-- ─────────────────────────────────────────────────────────────
-- 5. Richer account metadata on existing assets (all nullable → additive)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS institution   text;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS account_type  text;  -- Checking | Savings | Brokerage | IRA | Roth IRA | 401(k) | 529 | Prepaid | etc.
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS owner         text;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS as_of_date    date;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS apply_rmd     boolean;

-- ─────────────────────────────────────────────────────────────
-- RLS — mirror the posture used on assets/liabilities:
--   Karli full access, clients read their own, demo/anon read+write.
--   (The dashboard reads/writes via the service-role key, which bypasses RLS.)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.insurance_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estate_documents   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beneficiaries      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_members  ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['insurance_policies','estate_documents','beneficiaries','household_members']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Karli can do everything on %1$s" ON public.%1$s;', t);
    EXECUTE format($f$CREATE POLICY "Karli can do everything on %1$s" ON public.%1$s FOR ALL USING ((auth.jwt() ->> 'email') = 'karli@acorn-care.com');$f$, t);

    EXECUTE format('DROP POLICY IF EXISTS "Clients can view their own %1$s" ON public.%1$s;', t);
    EXECUTE format($f$CREATE POLICY "Clients can view their own %1$s" ON public.%1$s FOR SELECT USING (EXISTS (SELECT 1 FROM clients WHERE clients.id = %1$s.client_id AND clients.email = (auth.jwt() ->> 'email')));$f$, t);

    EXECUTE format('DROP POLICY IF EXISTS "demo_anon_read_%1$s" ON public.%1$s;', t);
    EXECUTE format('CREATE POLICY "demo_anon_read_%1$s" ON public.%1$s FOR SELECT TO anon USING (true);', t);

    EXECUTE format('DROP POLICY IF EXISTS "demo_anon_write_%1$s" ON public.%1$s;', t);
    EXECUTE format('CREATE POLICY "demo_anon_write_%1$s" ON public.%1$s FOR ALL TO anon USING (true) WITH CHECK (true);', t);
  END LOOP;
END $$;

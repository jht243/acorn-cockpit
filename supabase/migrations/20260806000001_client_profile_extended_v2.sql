-- Extended client profile data (v2) — captures eMoney fields previously dropped or buried in notes.
-- Purely additive: 4 new tables + 15 new nullable columns. Nothing existing altered or dropped.
--
-- New tables:  social_security_projections, client_advisors, business_partners, education_goals
-- New columns on liabilities:      institution, monthly_payment, term_months, origination_date,
--                                  origination_amount, linked_asset_label
-- New columns on assets:           purchase_amount, purchase_year, tax_basis, address,
--                                  inherited_year, distribution_method
-- New columns on insurance_policies: personal_property_coverage
-- New columns on household_members:  retirement_age, life_expectancy, employer, job_title, work_email

-- ─────────────────────────────────────────────────────────────
-- 1. Social Security projections (per household member)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.social_security_projections (
  id                    uuid        NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id             uuid        NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  person_name           text        NOT NULL,
  retirement_benefit    numeric,                  -- annual $ at full retirement age
  disability_benefit    numeric,                  -- annual $ if disabled
  survivor_benefit      numeric,                  -- annual $ to surviving child/spouse
  claim_age             integer,                  -- age at which client plans to claim
  years_employed        integer,
  highest_salary        numeric,
  notes                 text,
  source                text,                      -- 'eMoney', 'client-provided', etc.
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ssp_client_id_idx ON public.social_security_projections(client_id);

-- ─────────────────────────────────────────────────────────────
-- 2. Client Advisors — each client's existing outside professionals
--    (their CPA, estate attorney, insurance agent, etc.) — the raw list.
--    Distinct from professional_network table which holds Karli's referral network.
--    Where a match exists, professional_contact_id can point to that record.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.client_advisors (
  id                        uuid        NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id                 uuid        NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  role                      text        NOT NULL,     -- CPA | Estate Attorney | Insurance Agent | Banker | Business Attorney | Financial Advisor | Primary Care | Other
  name                      text,
  firm                      text,
  email                     text,
  phone                     text,
  notes                     text,
  professional_contact_id   uuid,                       -- optional link into Karli's network
  source                    text,
  created_at                timestamptz DEFAULT now(),
  updated_at                timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS client_advisors_client_id_idx ON public.client_advisors(client_id);

-- ─────────────────────────────────────────────────────────────
-- 3. Business Partners — multi-owner LLC / partnership detail
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.business_partners (
  id              uuid        NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id       uuid        NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  business_name   text        NOT NULL,               -- must match an assets.label ideally
  partner_name    text        NOT NULL,               -- e.g. "Stephen Flood"
  ownership_pct   numeric,                             -- 0-100
  role            text,                                -- "Managing Partner" | "Silent Partner" | etc.
  notes           text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS business_partners_client_id_idx ON public.business_partners(client_id);

-- ─────────────────────────────────────────────────────────────
-- 4. Education goals — structured beneficiary + time-window
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.education_goals (
  id                  uuid        NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id           uuid        NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  beneficiary_name    text        NOT NULL,           -- which child
  description         text        NOT NULL,           -- "Private School" | "University"
  institution         text,                            -- "University of Florida" | "—"
  annual_amount       numeric,
  start_year          integer,
  end_year            integer,
  tuition             numeric,
  room_board          numeric,
  books_supplies      numeric,
  other_expenses      numeric,
  scholarships        numeric,
  grants              numeric,
  outside_funds       numeric,
  notes               text,
  source              text,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS education_goals_client_id_idx ON public.education_goals(client_id);

-- ─────────────────────────────────────────────────────────────
-- 5. New columns on liabilities  (full mortgage/loan detail)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.liabilities ADD COLUMN IF NOT EXISTS institution        text;
ALTER TABLE public.liabilities ADD COLUMN IF NOT EXISTS monthly_payment    numeric;
ALTER TABLE public.liabilities ADD COLUMN IF NOT EXISTS term_months        integer;
ALTER TABLE public.liabilities ADD COLUMN IF NOT EXISTS origination_date   date;
ALTER TABLE public.liabilities ADD COLUMN IF NOT EXISTS origination_amount numeric;
ALTER TABLE public.liabilities ADD COLUMN IF NOT EXISTS linked_asset_label text;   -- soft link to assets.label
ALTER TABLE public.liabilities ADD COLUMN IF NOT EXISTS loan_type          text;   -- Mortgage | Student Loan | Auto | Business | Personal | Credit Card | Line Of Credit | Other

-- ─────────────────────────────────────────────────────────────
-- 6. New columns on assets  (property basis + inherited-IRA metadata)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS purchase_amount     numeric;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS purchase_year       integer;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS tax_basis           numeric;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS address             text;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS inherited_year      integer;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS distribution_method text;   -- "Stretch IRA" | "10-year" | etc.

-- ─────────────────────────────────────────────────────────────
-- 7. New column on insurance_policies
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.insurance_policies ADD COLUMN IF NOT EXISTS personal_property_coverage numeric;

-- ─────────────────────────────────────────────────────────────
-- 8. New columns on household_members  (per-person planning params + employment)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.household_members ADD COLUMN IF NOT EXISTS retirement_age  integer;
ALTER TABLE public.household_members ADD COLUMN IF NOT EXISTS life_expectancy integer;
ALTER TABLE public.household_members ADD COLUMN IF NOT EXISTS employer        text;
ALTER TABLE public.household_members ADD COLUMN IF NOT EXISTS job_title       text;
ALTER TABLE public.household_members ADD COLUMN IF NOT EXISTS work_email      text;

-- ─────────────────────────────────────────────────────────────
-- RLS — mirror the existing posture (Karli full access, clients read own, demo/anon r/w)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.social_security_projections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_advisors             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_partners           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_goals             ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['social_security_projections','client_advisors','business_partners','education_goals']
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

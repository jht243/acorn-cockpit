-- ============================================================
-- UPDATE PROFESSIONAL TAGS — Karli's confirmed taxonomy
-- ============================================================

-- Add missing profession tags
insert into professional_tags (workspace_id, slug, label, category) values
  ('00000000-0000-0000-0000-000000000001', 'business_attorney',              'Business Attorney',               'profession'),
  ('00000000-0000-0000-0000-000000000001', 'divorce_attorney',               'Divorce Attorney',                'profession'),
  ('00000000-0000-0000-0000-000000000001', 'sports_entertainment_attorney',  'Sports & Entertainment Attorney', 'profession')
on conflict (workspace_id, slug) do nothing;

-- Add missing specialty tags
insert into professional_tags (workspace_id, slug, label, category) values
  ('00000000-0000-0000-0000-000000000001', 'complex_estate_planning', 'Complex Estate Planning', 'specialty'),
  ('00000000-0000-0000-0000-000000000001', 'forensic_accounting',     'Forensic Accounting',     'specialty'),
  ('00000000-0000-0000-0000-000000000001', 'business_law',            'Business Law',            'specialty'),
  ('00000000-0000-0000-0000-000000000001', 'pc_insurance',            'P&C Insurance',           'specialty'),
  ('00000000-0000-0000-0000-000000000001', 'health_insurance',        'Health Insurance',        'specialty'),
  ('00000000-0000-0000-0000-000000000001', 'entertainment_law',       'Entertainment Law',       'specialty')
on conflict (workspace_id, slug) do nothing;

-- Add missing working style tag
insert into professional_tags (workspace_id, slug, label, category) values
  ('00000000-0000-0000-0000-000000000001', 'fairly_priced', 'Fairly Priced', 'working_style')
on conflict (workspace_id, slug) do nothing;

-- Remove Haitian Creole (not used by Karli's practice)
delete from professional_tags
  where workspace_id = '00000000-0000-0000-0000-000000000001'
    and slug = 'haitian_creole';

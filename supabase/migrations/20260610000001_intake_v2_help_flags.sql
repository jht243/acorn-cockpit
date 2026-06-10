-- Intake V2: add help request and review-with-Acorn tracking columns
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS help_requested BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS help_request_section TEXT,
  ADD COLUMN IF NOT EXISTS review_with_acorn_sections JSONB DEFAULT '[]';

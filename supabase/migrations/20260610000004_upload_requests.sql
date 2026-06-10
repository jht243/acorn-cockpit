-- Upload request tokens — lets Karli email a client a secure, expiring upload link.

CREATE TABLE IF NOT EXISTS public.upload_requests (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id   uuid        NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  token       text        UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  note        text,                              -- optional message Karli adds to the email
  created_by  text        NOT NULL DEFAULT 'karli',
  expires_at  timestamptz NOT NULL DEFAULT now() + interval '30 days',
  used_at     timestamptz,                       -- set when client submits docs
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Index for fast token lookups on the client upload page
CREATE INDEX IF NOT EXISTS upload_requests_token_idx ON public.upload_requests(token);

-- RLS
ALTER TABLE public.upload_requests ENABLE ROW LEVEL SECURITY;

-- Anon can read a single row by token (needed to validate the link on the upload page)
CREATE POLICY "anon_read_upload_request_by_token"
  ON public.upload_requests FOR SELECT
  TO anon
  USING (true);

-- Only service_role can insert / update
CREATE POLICY "service_role_insert_upload_request"
  ON public.upload_requests FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "service_role_update_upload_request"
  ON public.upload_requests FOR UPDATE
  TO service_role
  USING (true);

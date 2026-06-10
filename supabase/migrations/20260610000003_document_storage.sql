-- ─────────────────────────────────────────────────────────────────────────────
-- Step 1: Document storage
-- Adds storage_path / size / uploader columns to documents table,
-- creates the private client-documents bucket, and locks Storage to service_role.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Extend the documents table with storage columns
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS storage_path  text,
  ADD COLUMN IF NOT EXISTS size_bytes    bigint,
  ADD COLUMN IF NOT EXISTS uploaded_by   text;  -- 'karli' | 'client'

-- 2. Create the private Storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'client-documents',
  'client-documents',
  false,                      -- private — no public URL access ever
  52428800,                   -- 50 MB per file
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage RLS: only service_role can read/write objects in this bucket.
--    Files are never accessed directly — only via signed URLs generated server-side.

CREATE POLICY "service_role_insert_client_docs"
  ON storage.objects FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'client-documents');

CREATE POLICY "service_role_select_client_docs"
  ON storage.objects FOR SELECT
  TO service_role
  USING (bucket_id = 'client-documents');

CREATE POLICY "service_role_update_client_docs"
  ON storage.objects FOR UPDATE
  TO service_role
  USING (bucket_id = 'client-documents');

CREATE POLICY "service_role_delete_client_docs"
  ON storage.objects FOR DELETE
  TO service_role
  USING (bucket_id = 'client-documents');

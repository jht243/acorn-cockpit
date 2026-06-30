-- Stage 2: search vector refresh function
-- Called by application code after any write to contacts, notes, or tags.
-- Keeps tsvector in sync without a SQL trigger (easier to debug at this scale).

create or replace function refresh_contact_search_vector(p_contact_id uuid)
returns void
language sql
security definer
as $$
  update contact_search_documents
  set
    search_vector = to_tsvector('english', search_text),
    updated_at    = now()
  where contact_id = p_contact_id;
$$;

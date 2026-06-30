-- Stage 4: full-text search function for professional contacts
-- Called via supabase.rpc('search_professional_contacts', { p_query: '...' })
-- Ranking order per architecture Section 7:
--   1. accepting_status (accepting > limited > unknown > not_accepting)
--   2. relationship_strength (strong > warm > cold > unknown)
--   3. ts_rank text relevance

create or replace function search_professional_contacts(
  p_query     text,
  p_workspace uuid default '00000000-0000-0000-0000-000000000001'
)
returns table (
  id                           uuid,
  workspace_id                 uuid,
  full_name                    text,
  firm_name                    text,
  title                        text,
  email                        text,
  phone                        text,
  city                         text,
  region                       text,
  state_province               text,
  accepting_status             text,
  accepting_status_verified_at timestamptz,
  relationship_strength        text,
  do_not_refer                 boolean,
  do_not_refer_reason          text,
  created_by                   uuid,
  updated_by                   uuid,
  created_at                   timestamptz,
  updated_at                   timestamptz,
  archived_at                  timestamptz,
  deleted_at                   timestamptz,
  text_rank                    real
)
language sql
security definer
stable
as $$
  select
    pc.id,
    pc.workspace_id,
    pc.full_name,
    pc.firm_name,
    pc.title,
    pc.email,
    pc.phone,
    pc.city,
    pc.region,
    pc.state_province,
    pc.accepting_status,
    pc.accepting_status_verified_at,
    pc.relationship_strength,
    pc.do_not_refer,
    pc.do_not_refer_reason,
    pc.created_by,
    pc.updated_by,
    pc.created_at,
    pc.updated_at,
    pc.archived_at,
    pc.deleted_at,
    ts_rank(csd.search_vector, websearch_to_tsquery('english', p_query)) as text_rank
  from professional_contacts pc
  join contact_search_documents csd on csd.contact_id = pc.id
  where
    pc.workspace_id  = p_workspace
    and pc.deleted_at  is null
    and pc.archived_at is null
    and csd.search_vector @@ websearch_to_tsquery('english', p_query)
  order by
    case pc.accepting_status
      when 'accepting'     then 1
      when 'limited'       then 2
      when 'unknown'       then 3
      when 'not_accepting' then 4
    end,
    case pc.relationship_strength
      when 'strong'  then 1
      when 'warm'    then 2
      when 'cold'    then 3
      when 'unknown' then 4
    end,
    ts_rank(csd.search_vector, websearch_to_tsquery('english', p_query)) desc;
$$;

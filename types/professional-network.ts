export type AcceptingStatus = 'unknown' | 'accepting' | 'limited' | 'not_accepting'
export type RelationshipStrength = 'unknown' | 'cold' | 'warm' | 'strong'
export type TagCategory = 'profession' | 'specialty' | 'client_situation' | 'language' | 'working_style'

export interface ProfessionalContact {
  id: string
  workspace_id: string
  full_name: string
  firm_name: string | null
  title: string | null
  email: string | null
  phone: string | null
  city: string | null
  region: string | null
  state_province: string | null
  accepting_status: AcceptingStatus
  accepting_status_verified_at: string | null
  relationship_strength: RelationshipStrength
  do_not_refer: boolean
  do_not_refer_reason: string | null
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
  archived_at: string | null
  deleted_at: string | null
  // joined in detail view
  professional_contact_notes?: ContactNote[]
  professional_contact_tags?: { tag: ProfessionalTag }[]
  sub_contacts?: SubContact[]
}

export interface ContactNote {
  id: string
  contact_id: string
  note_text: string
  include_in_search: boolean
  created_by: string | null
  created_at: string
  deleted_at: string | null
}

export interface SubContact {
  id: string
  parent_contact_id: string
  full_name: string
  role: string | null
  phone: string | null
  email: string | null
  notes: string | null
  created_at: string
}

export interface ProfessionalTag {
  id: string
  slug: string
  label: string
  category: TagCategory
  archived_at: string | null
}

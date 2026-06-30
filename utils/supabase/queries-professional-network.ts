import { createServiceRoleClient } from './service'
import type { ProfessionalContact, ProfessionalTag } from '@/types/professional-network'

export async function getProfessionalContacts(): Promise<ProfessionalContact[]> {
  const db = createServiceRoleClient()
  const { data, error } = await db
    .from('professional_contacts')
    .select('*, professional_contact_tags ( tag:professional_tags ( id, slug, label, category ) )')
    .is('deleted_at', null)
    .is('archived_at', null)
    .order('full_name', { ascending: true })

  if (error) { console.error('getProfessionalContacts:', error); return [] }
  return data as ProfessionalContact[]
}

export async function getAllTags(): Promise<ProfessionalTag[]> {
  const db = createServiceRoleClient()
  const { data, error } = await db
    .from('professional_tags')
    .select('*')
    .is('archived_at', null)
    .order('category')
    .order('label')

  if (error) { console.error('getAllTags:', error); return [] }
  return data as ProfessionalTag[]
}

export async function getProfessionalContactById(id: string): Promise<ProfessionalContact | null> {
  const db = createServiceRoleClient()
  const { data, error } = await db
    .from('professional_contacts')
    .select(`
      *,
      professional_contact_notes ( * ),
      professional_contact_tags ( tag:professional_tags ( * ) ),
      sub_contacts ( * )
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) { console.error('getProfessionalContactById:', error); return null }
  return data as ProfessionalContact
}

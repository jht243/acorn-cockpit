import { createServiceRoleClient } from '@/utils/supabase/service'

// Rebuilds the search document for a contact after any write to the contact,
// its notes, its tags, or its sub-contacts.
// Client-specific facts (client_intro_log) are never included here.
export async function refreshSearchDoc(contactId: string): Promise<void> {
  const db = createServiceRoleClient()

  const { data: contact } = await db
    .from('professional_contacts')
    .select(`
      full_name, firm_name, title, city, region, state_province,
      workspace_id,
      sub_contacts ( full_name ),
      professional_contact_notes ( note_text, include_in_search, deleted_at ),
      professional_contact_tags ( tag:professional_tags ( label ) )
    `)
    .eq('id', contactId)
    .is('deleted_at', null)
    .single()

  if (!contact) return

  const parts: string[] = [
    contact.full_name,
    contact.firm_name,
    contact.title,
    contact.city,
    contact.region,
    contact.state_province,
    ...(contact.sub_contacts ?? []).map((sc: any) => sc.full_name),
    ...(contact.professional_contact_notes ?? [])
      .filter((n: any) => n.include_in_search && !n.deleted_at)
      .map((n: any) => n.note_text),
    ...(contact.professional_contact_tags ?? []).map((ct: any) => ct.tag?.label),
  ].filter(Boolean) as string[]

  const searchText = parts.join(' ')

  await db.from('contact_search_documents').upsert({
    contact_id: contactId,
    workspace_id: contact.workspace_id,
    search_text: searchText,
    updated_at: new Date().toISOString(),
  })

  await db.rpc('refresh_contact_search_vector', { p_contact_id: contactId })
}

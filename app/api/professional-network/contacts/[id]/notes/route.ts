import { createClient } from '@/utils/supabase/server'
import { createServiceRoleClient } from '@/utils/supabase/service'
import { refreshSearchDoc } from '@/utils/professional-network/refresh-search-doc'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { note_text, include_in_search } = await request.json()
  if (!note_text?.trim()) return Response.json({ error: 'note_text is required' }, { status: 400 })

  const db = createServiceRoleClient()
  const { data, error } = await db
    .from('professional_contact_notes')
    .insert({
      contact_id: id,
      note_text: note_text.trim(),
      include_in_search: include_in_search ?? true,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  await refreshSearchDoc(id)
  return Response.json(data, { status: 201 })
}

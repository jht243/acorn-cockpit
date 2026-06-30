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
  const { tag_id } = await request.json()
  if (!tag_id) return Response.json({ error: 'tag_id is required' }, { status: 400 })

  const db = createServiceRoleClient()
  const { error } = await db
    .from('professional_contact_tags')
    .insert({ contact_id: id, tag_id })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  await refreshSearchDoc(id)
  return Response.json({ ok: true }, { status: 201 })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { tag_id } = await request.json()
  if (!tag_id) return Response.json({ error: 'tag_id is required' }, { status: 400 })

  const db = createServiceRoleClient()
  const { error } = await db
    .from('professional_contact_tags')
    .delete()
    .eq('contact_id', id)
    .eq('tag_id', tag_id)

  if (error) return Response.json({ error: error.message }, { status: 500 })

  await refreshSearchDoc(id)
  return Response.json({ ok: true })
}

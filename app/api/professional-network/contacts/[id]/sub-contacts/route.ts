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
  const { full_name, role, phone, email, notes } = await request.json()
  if (!full_name?.trim()) return Response.json({ error: 'full_name is required' }, { status: 400 })

  const db = createServiceRoleClient()
  const { data, error } = await db
    .from('sub_contacts')
    .insert({
      parent_contact_id: id,
      full_name: full_name.trim(),
      role: role?.trim() || null,
      phone: phone?.trim() || null,
      email: email?.trim() || null,
      notes: notes?.trim() || null,
    })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  await refreshSearchDoc(id)
  return Response.json(data, { status: 201 })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { sub_contact_id } = await request.json()
  if (!sub_contact_id) return Response.json({ error: 'sub_contact_id is required' }, { status: 400 })

  const db = createServiceRoleClient()
  const { error } = await db
    .from('sub_contacts')
    .delete()
    .eq('id', sub_contact_id)
    .eq('parent_contact_id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })

  await refreshSearchDoc(id)
  return Response.json({ ok: true })
}

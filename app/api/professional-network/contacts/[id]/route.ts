import { createClient } from '@/utils/supabase/server'
import { createServiceRoleClient } from '@/utils/supabase/service'
import { refreshSearchDoc } from '@/utils/professional-network/refresh-search-doc'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
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

  if (error) return Response.json({ error: error.message }, { status: 404 })
  return Response.json(data)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  // Strip any fields that shouldn't be patched directly
  const { id: _id, created_at: _ca, created_by: _cb, workspace_id: _ws, ...fields } = body

  const db = createServiceRoleClient()
  const { data, error } = await db
    .from('professional_contacts')
    .update({ ...fields, updated_by: user.id, updated_at: new Date().toISOString() })
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  await refreshSearchDoc(id)

  return Response.json(data)
}

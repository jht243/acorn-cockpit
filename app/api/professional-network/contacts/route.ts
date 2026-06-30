import { createClient } from '@/utils/supabase/server'
import { createServiceRoleClient } from '@/utils/supabase/service'
import { refreshSearchDoc } from '@/utils/professional-network/refresh-search-doc'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceRoleClient()
  const { data, error } = await db
    .from('professional_contacts')
    .select('*, professional_contact_tags ( tag:professional_tags ( id, slug, label, category ) )')
    .is('deleted_at', null)
    .is('archived_at', null)
    .order('full_name', { ascending: true })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const {
    full_name, firm_name, title, email, phone,
    city, region, state_province,
    accepting_status, relationship_strength,
    do_not_refer, do_not_refer_reason,
  } = body

  if (!full_name?.trim()) {
    return Response.json({ error: 'full_name is required' }, { status: 400 })
  }

  const db = createServiceRoleClient()
  const { data, error } = await db
    .from('professional_contacts')
    .insert({
      full_name: full_name.trim(),
      firm_name: firm_name?.trim() || null,
      title: title?.trim() || null,
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      city: city?.trim() || null,
      region: region?.trim() || null,
      state_province: state_province?.trim() || 'FL',
      accepting_status: accepting_status || 'unknown',
      relationship_strength: relationship_strength || 'unknown',
      do_not_refer: do_not_refer ?? false,
      do_not_refer_reason: do_not_refer_reason?.trim() || null,
      created_by: user.id,
      updated_by: user.id,
    })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  await refreshSearchDoc(data.id)

  return Response.json(data, { status: 201 })
}

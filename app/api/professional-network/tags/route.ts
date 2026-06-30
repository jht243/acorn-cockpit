import { createClient } from '@/utils/supabase/server'
import { createServiceRoleClient } from '@/utils/supabase/service'
import type { TagCategory } from '@/types/professional-network'

const VALID_CATEGORIES: TagCategory[] = ['profession', 'specialty', 'client_situation', 'language', 'working_style']
const WORKSPACE_ID = '00000000-0000-0000-0000-000000000001'

function toSlug(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')   // strip special chars
    .replace(/\s+/g, '_')           // spaces → underscores
    .replace(/^_+|_+$/g, '')        // trim leading/trailing underscores
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { label, category } = await request.json()

  if (!label?.trim()) {
    return Response.json({ error: 'label is required' }, { status: 400 })
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return Response.json({ error: 'invalid category' }, { status: 400 })
  }

  const slug = toSlug(label.trim())
  if (!slug) {
    return Response.json({ error: 'label produces an empty slug — use letters and numbers' }, { status: 400 })
  }

  const db = createServiceRoleClient()

  // Check for existing tag with same slug in this workspace before insert
  // so we can return a friendly error rather than a raw constraint violation
  const { data: existing } = await db
    .from('professional_tags')
    .select('id, label, slug')
    .eq('workspace_id', WORKSPACE_ID)
    .eq('slug', slug)
    .maybeSingle()

  if (existing) {
    return Response.json(
      { error: `"${existing.label}" already exists with this name`, existing },
      { status: 409 }
    )
  }

  const { data, error } = await db
    .from('professional_tags')
    .insert({
      workspace_id: WORKSPACE_ID,
      slug,
      label: label.trim(),
      category,
    })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data, { status: 201 })
}

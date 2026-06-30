import { createClient } from '@/utils/supabase/server'
import { createServiceRoleClient } from '@/utils/supabase/service'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()
  if (!q) return Response.json([])

  const db = createServiceRoleClient()

  // Run ranked full-text search via the Postgres function
  const { data: results, error } = await db
    .rpc('search_professional_contacts', { p_query: q })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  if (!results || results.length === 0) return Response.json([])

  // Fetch tags for the returned contacts so the table can display them
  const ids = results.map((r: any) => r.id)
  const { data: tagRows } = await db
    .from('professional_contact_tags')
    .select('contact_id, tag:professional_tags ( id, slug, label, category )')
    .in('contact_id', ids)

  // Index tags by contact_id
  const tagsByContact: Record<string, any[]> = {}
  for (const row of tagRows ?? []) {
    if (!tagsByContact[row.contact_id]) tagsByContact[row.contact_id] = []
    tagsByContact[row.contact_id].push({ tag: row.tag })
  }

  // Merge tags into results (preserving ranked order)
  const enriched = results.map((r: any) => ({
    ...r,
    professional_contact_tags: tagsByContact[r.id] ?? [],
  }))

  return Response.json(enriched)
}

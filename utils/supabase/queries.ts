import { createServiceRoleClient } from './service'

export async function getClients() {
  const supabase = createServiceRoleClient()
  const { data, error } = await supabase
    .from('clients')
    .select(`*, assets (*), liabilities (*), action_items (*), meetings (*), documents (*)`)
    .order('name', { ascending: true })

  if (error) { console.error('Error fetching clients:', error); return [] }
  return data
}

export async function getClientById(id: string) {
  const supabase = createServiceRoleClient()
  const { data, error } = await supabase
    .from('clients')
    .select(`*, assets (*), liabilities (*), action_items (*), meetings (*), documents (*), insurance_policies (*), estate_documents (*), beneficiaries (*), household_members (*)`)
    .eq('id', id)
    .single()

  if (error) { console.error('Error fetching client:', error); return null }
  return normalizeJsonbArrays(data)
}

export async function getClientByIntakeToken(token: string) {
  const supabase = createServiceRoleClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('intake_token', token)
    .maybeSingle()

  if (error) { console.error('Error fetching client by token:', error); return null }
  return data
}

// Defensive: some legacy rows stored jsonb array columns as JSON *strings*.
// Coerce them back to arrays so consumers (.map/.reduce) don't crash.
function normalizeJsonbArrays<T extends Record<string, any> | null>(client: T): T {
  if (!client) return client
  for (const key of ['goals', 'income', 'expenses', 'intake_responses', 'team'] as const) {
    const v = (client as any)[key]
    if (typeof v === 'string') {
      try {
        const parsed = JSON.parse(v)
        ;(client as any)[key] = Array.isArray(parsed) ? parsed : []
      } catch {
        ;(client as any)[key] = []
      }
    }
  }
  return client
}

export { intakeProgress } from '@/lib/intake-progress'

import { createClient } from './server'

export async function getClients() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      assets (*),
      liabilities (*),
      action_items (*),
      meetings (*),
      documents (*)
    `)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching clients:', error)
    return []
  }
  return data
}

export async function getClientById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      assets (*),
      liabilities (*),
      action_items (*),
      meetings (*),
      documents (*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching client:', error)
    return null
  }
  return data
}

export async function getClientByIntakeToken(token: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('intake_token', token)
    .maybeSingle()

  if (error) {
    console.error('Error fetching client by token:', error)
    return null
  }
  return data
}

export function intakeProgress(client: { intake_invited_at?: string | null; intake_started_at?: string | null; intake_submitted_at?: string | null }) {
  if (client.intake_submitted_at) return { label: 'Submitted', pct: 100, kind: 'done' as const }
  if (client.intake_started_at) return { label: 'In progress', pct: 50, kind: 'in_progress' as const }
  if (client.intake_invited_at) return { label: 'Invited', pct: 10, kind: 'invited' as const }
  return { label: 'Not started', pct: 0, kind: 'none' as const }
}

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

export { intakeProgress } from '@/lib/intake-progress'

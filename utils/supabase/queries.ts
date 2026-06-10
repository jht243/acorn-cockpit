import { clients as mockClients } from '@/lib/data'

const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// Normalize mock client shape to match the DB shape the pages expect
function normalizeMock(c: any) {
  return {
    ...c,
    action_items: (c.actions || []).map((a: any) => ({
      ...a,
      due_date: a.due,
      source_meeting: a.sourceMeeting,
    })),
    last_contact: c.lastContact,
    next_meeting: c.nextMeeting,
    last_contact_signal: c.lastContactSignal,
    intake_submitted_at: c.plan !== 'Intake' ? '2025-01-01' : null,
    intake_invited_at: c.plan === 'Intake' ? '2025-02-01' : null,
    intake_started_at: c.plan === 'Intake' ? '2025-02-05' : null,
    intake_last_reminder_at: null,
    intake_reminders_sent: 0,
    intake_token: `mock-token-${c.id}`,
    intake_form_data: null,
    help_requested: c.helpRequested ?? false,
    help_request_section: c.help_request_section ?? null,
    review_with_acorn_sections: c.review_with_acorn_sections ?? [],
    intakeResponses: c.intakeResponses,
    plaidAccounts: c.plaidAccounts,
    meetings: (c.meetings || []).map((m: any) => ({ ...m, meeting_date: m.date })),
  }
}

export async function getClients() {
  if (!hasSupabase) return mockClients.map(normalizeMock)

  const { createClient } = await import('./server')
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select(`*, assets (*), liabilities (*), action_items (*), meetings (*), documents (*)`)
    .order('name', { ascending: true })

  if (error) { console.error('Error fetching clients:', error); return [] }
  return data
}

export async function getClientById(id: string) {
  if (!hasSupabase) {
    const c = mockClients.find((c) => c.id === id)
    return c ? normalizeMock(c) : null
  }

  const { createClient } = await import('./server')
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select(`*, assets (*), liabilities (*), action_items (*), meetings (*), documents (*)`)
    .eq('id', id)
    .single()

  if (error) { console.error('Error fetching client:', error); return null }
  return normalizeJsonbArrays(data)
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

export async function getClientByIntakeToken(token: string) {
  if (!hasSupabase) return null

  const { createClient } = await import('./server')
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('intake_token', token)
    .maybeSingle()

  if (error) { console.error('Error fetching client by token:', error); return null }
  return data
}

export { intakeProgress } from '@/lib/intake-progress'

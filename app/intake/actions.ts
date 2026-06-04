'use server'

import { createClient } from '@/utils/supabase/server'
import { sendIntakeCompletionEmail } from '@/lib/resend'
import { computeIntakeCompletionPct } from '@/lib/intake-progress'
import { revalidatePath } from 'next/cache'

export async function markIntakeStarted(token: string) {
  const supabase = await createClient()
  const { data: existing } = await supabase
    .from('clients')
    .select('id, intake_started_at')
    .eq('intake_token', token)
    .maybeSingle()
  if (existing && !existing.intake_started_at) {
    await supabase
      .from('clients')
      .update({ intake_started_at: new Date().toISOString() })
      .eq('id', existing.id)
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/clients')
  }
}

export async function saveIntakeProgress(token: string, formData: any) {
  if (!token) return { success: false }
  const supabase = await createClient()
  const pct = computeIntakeCompletionPct(formData)
  const { data: existing } = await supabase
    .from('clients')
    .select('id, intake_started_at')
    .eq('intake_token', token)
    .maybeSingle()
  if (!existing) return { success: false }

  await supabase
    .from('clients')
    .update({
      intake_form_data: formData,
      intake_completion_pct: pct,
      intake_started_at: existing.intake_started_at || new Date().toISOString(),
    })
    .eq('id', existing.id)

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/clients')
  revalidatePath(`/dashboard/clients/${existing.id}`)
  return { success: true, pct }
}

export async function submitIntake(data: any) {
  const supabase = await createClient()
  const token = data.token as string | undefined

  let clientId: string | null = null
  let clientName = data.clientName || 'Unknown Client'
  let clientEmail = data.email || `unknown-${Date.now()}@example.com`

  const clientPayload: any = {
    name: clientName,
    email: clientEmail,
    family: data.spouseName ? `Spouse: ${data.spouseName}. Children: ${data.children}` : data.children,
    goals: JSON.stringify([data.goals]),
    income: JSON.stringify([{ label: 'Annual Income', annual: Number(data.annualIncome) || 0 }]),
    expenses: JSON.stringify([{ label: 'Monthly Expenses', monthly: Number(data.monthlyExpenses) || 0 }]),
    intake_responses: JSON.stringify([
      { question: 'DOB', answer: data.dob },
      { question: 'Spouse DOB', answer: data.spouseDob },
      { question: 'Phone', answer: data.phone },
      { question: 'Address', answer: data.address },
      { question: 'Risk Tolerance', answer: data.risk },
      { question: 'Has Will', answer: data.hasWill },
      { question: 'Has Trust', answer: data.hasTrust },
      { question: 'Has Life Insurance', answer: data.hasLifeIns },
      { question: 'Estate Plan Notes', answer: data.estatePlanNotes },
      { question: 'Largest Obstacle', answer: data.largestObstacle },
    ]),
    intake_submitted_at: new Date().toISOString(),
    intake_completion_pct: 100,
    status: 'Review',
  }

  if (token) {
    const { data: existing } = await supabase
      .from('clients')
      .select('id, name, email')
      .eq('intake_token', token)
      .maybeSingle()

    if (existing) {
      clientId = existing.id
      clientName = clientPayload.name = data.clientName || existing.name
      clientEmail = clientPayload.email = data.email || existing.email
      const { error: updateError } = await supabase
        .from('clients')
        .update(clientPayload)
        .eq('id', existing.id)
      if (updateError) {
        console.error('Error updating client:', updateError)
        return { success: false, error: updateError.message }
      }
      // Wipe and reinsert assets/liabilities for this client (idempotent submit)
      await supabase.from('assets').delete().eq('client_id', existing.id)
      await supabase.from('liabilities').delete().eq('client_id', existing.id)
    }
  }

  if (!clientId) {
    const { data: created, error: clientError } = await supabase
      .from('clients')
      .insert({ ...clientPayload, plan: 'Intake' })
      .select()
      .single()
    if (clientError || !created) {
      console.error('Error creating client:', clientError)
      return { success: false, error: clientError?.message }
    }
    clientId = created.id
  }

  if (data.assets?.length) {
    const assetsToInsert = data.assets
      .filter((a: any) => a.label && a.value)
      .map((a: any) => ({
        client_id: clientId,
        label: a.label,
        value: Number(String(a.value).replace(/[^0-9.-]+/g, '')),
        category: a.category,
        source: 'Manual',
      }))
    if (assetsToInsert.length > 0) await supabase.from('assets').insert(assetsToInsert)
  }

  if (data.liabilities?.length) {
    const liabilitiesToInsert = data.liabilities
      .filter((l: any) => l.label && l.balance)
      .map((l: any) => ({
        client_id: clientId,
        label: l.label,
        balance: Number(String(l.balance).replace(/[^0-9.-]+/g, '')),
        rate: Number(String(l.rate || '').replace(/[^0-9.-]+/g, '')) || null,
        source: 'Manual',
      }))
    if (liabilitiesToInsert.length > 0) await supabase.from('liabilities').insert(liabilitiesToInsert)
  }

  if (clientEmail && clientName) {
    await sendIntakeCompletionEmail(clientName, clientEmail)
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/clients')
  return { success: true, clientId }
}

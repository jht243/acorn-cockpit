'use server'

import { createClient } from '@/utils/supabase/server'
import { sendIntakeCompletionEmail } from '@/lib/resend'

export async function submitIntake(data: any) {
  const supabase = await createClient()

  // Create the client record
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .insert({
      name: data.clientName || 'Unknown Client',
      email: data.email || `unknown-${Date.now()}@example.com`,
      plan: 'Intake',
      status: 'Onboarding',
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
      ])
    })
    .select()
    .single()

  if (clientError || !client) {
    console.error('Error creating client:', clientError)
    return { success: false, error: clientError }
  }

  // Insert assets
  if (data.assets && data.assets.length > 0) {
    const assetsToInsert = data.assets
      .filter((a: any) => a.label && a.value)
      .map((a: any) => ({
        client_id: client.id,
        label: a.label,
        value: Number(a.value.replace(/[^0-9.-]+/g, "")),
        category: a.category,
        source: 'Manual'
      }))
    
    if (assetsToInsert.length > 0) {
      await supabase.from('assets').insert(assetsToInsert)
    }
  }

  // Insert liabilities
  if (data.liabilities && data.liabilities.length > 0) {
    const liabilitiesToInsert = data.liabilities
      .filter((l: any) => l.label && l.balance)
      .map((l: any) => ({
        client_id: client.id,
        label: l.label,
        balance: Number(l.balance.replace(/[^0-9.-]+/g, "")),
        rate: Number(l.rate.replace(/[^0-9.-]+/g, "")) || null,
        source: 'Manual'
      }))
    
    if (liabilitiesToInsert.length > 0) {
      await supabase.from('liabilities').insert(liabilitiesToInsert)
    }
  }

  // Send email notification to Karli
  if (data.email && data.clientName) {
    await sendIntakeCompletionEmail(data.clientName, data.email)
  }

  return { success: true, clientId: client.id }
}

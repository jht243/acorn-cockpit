'use server'

import { createServiceRoleClient } from '@/utils/supabase/service'
import { sendIntakeCompletionEmail, sendIntakeConfirmationEmail } from '@/lib/resend'
import { computeIntakeCompletionPct } from '@/lib/intake-progress'
import { revalidatePath } from 'next/cache'

export async function getIntakeFormData(token: string) {
  if (!token) return null
  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from('clients')
    .select('name, email, intake_form_data, intake_submitted_at')
    .eq('intake_token', token)
    .maybeSingle()
  return data
}

export async function markIntakeStarted(token: string) {
  const supabase = createServiceRoleClient()
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
  const supabase = createServiceRoleClient()
  const pct = computeIntakeCompletionPct(formData)
  const { data: existing } = await supabase
    .from('clients')
    .select('id, intake_started_at, intake_completion_pct, intake_submitted_at')
    .eq('intake_token', token)
    .maybeSingle()
  if (!existing) return { success: false }

  // Don't clobber a submitted intake or regress a real completion percent
  // back to 0 (defends against a fresh page load saving the empty initial
  // form state before the existing data has hydrated).
  if (existing.intake_submitted_at) return { success: true, pct: 100 }
  if (pct === 0 && (existing.intake_completion_pct || 0) > 0) {
    return { success: true, pct: existing.intake_completion_pct || 0 }
  }

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

/**
 * Save a "Book help call" flag from the intake form.
 * Surfaces in Karli's dashboard as a priority item.
 */
export async function saveHelpRequest(token: string, section: string) {
  if (!token) return { success: false }
  const supabase = createServiceRoleClient()
  const { data: existing } = await supabase
    .from('clients')
    .select('id, intake_form_data')
    .eq('intake_token', token)
    .maybeSingle()
  if (!existing) return { success: false }

  const updatedFormData = {
    ...(existing.intake_form_data || {}),
    helpRequested: true,
    helpRequestSection: section,
  }

  await supabase
    .from('clients')
    .update({
      help_requested: true,
      help_request_section: section,
      intake_form_data: updatedFormData,
    })
    .eq('id', existing.id)

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/clients')
  revalidatePath(`/dashboard/clients/${existing.id}`)
  return { success: true }
}

/**
 * Save a "Review with Acorn" section-level flag from the intake form.
 */
export async function saveReviewFlag(token: string, section: string) {
  if (!token) return { success: false }
  const supabase = createServiceRoleClient()
  const { data: existing } = await supabase
    .from('clients')
    .select('id, intake_form_data')
    .eq('intake_token', token)
    .maybeSingle()
  if (!existing) return { success: false }

  const current: string[] = existing.intake_form_data?.reviewWithAcornSections || []
  const updated = current.includes(section) ? current : [...current, section]

  const updatedFormData = {
    ...(existing.intake_form_data || {}),
    reviewWithAcornSections: updated,
  }

  await supabase
    .from('clients')
    .update({
      review_with_acorn_sections: updated,
      intake_form_data: updatedFormData,
    })
    .eq('id', existing.id)

  return { success: true }
}

// Map internal camelCase role keys to readable labels
function roleLabel(key: string): string {
  const labels: Record<string, string> = {
    cpa: 'CPA / Tax Professional',
    estateAttorney: 'Estate Attorney',
    financialAdvisor: 'Financial Advisor',
    insuranceAgent: 'Insurance Agent',
    banker: 'Banker / Lender',
    businessAttorney: 'Business Attorney',
    other: 'Other Professional',
  }
  return labels[key] || key
}

export async function submitIntake(data: any) {
  const supabase = createServiceRoleClient()
  const token = data.token as string | undefined

  let clientId: string | null = null
  let clientName = data.clientName || 'Unknown Client'
  let clientEmail = data.email || `unknown-${Date.now()}@example.com`

  // Combine multi-select goals with any free-text the client added.
  const goalsSelected: string[] = Array.isArray(data.goalsSelected) ? data.goalsSelected : []
  const goalsCombined = [...goalsSelected, data.goals].filter(Boolean)

  // Dependents: selected chips + free-text + planning involvement
  const dependentsSelected: string[] = Array.isArray(data.dependentsSelected) ? data.dependentsSelected : []
  const planningInvolvement: string[] = Array.isArray(data.planningInvolvement) ? data.planningInvolvement : []
  const dependentsSummary = [dependentsSelected.join(', '), data.children].filter(Boolean).join(' — ')
  const familySummary = [
    data.spouseName ? `Spouse: ${data.spouseName}` : '',
    dependentsSummary,
    planningInvolvement.length ? `Planning involvement: ${planningInvolvement.join(', ')}` : '',
  ]
    .filter(Boolean)
    .join('. ')

  // Professional team: map structured entries to ProTeam[] format for dashboard
  const teamEntries: any[] = []
  if (data.professionalTeam) {
    for (const [key, v] of Object.entries(data.professionalTeam as Record<string, any>)) {
      if (v?.dontHave) continue
      if (!v?.name && !v?.firm && !v?.email) continue
      teamEntries.push({
        role: key === 'other' ? (v.role || 'Other Professional') : roleLabel(key),
        name: v.name || '—',
        firm: v.firm || undefined,
        email: v.email || undefined,
        contactPermission: v.contactPermission || undefined,
      })
    }
  }

  // Strip the token from stored form data
  const { token: _token, ...formDataToStore } = data

  const reviewWithAcornSections: string[] = Array.isArray(data.reviewWithAcornSections)
    ? data.reviewWithAcornSections
    : []

  const clientPayload: any = {
    name: clientName,
    email: clientEmail,
    family: familySummary || data.children,
    goals: goalsCombined,
    income: [{ label: 'Annual Income', annual: Number(data.annualIncome) || 0 }],
    expenses: [{ label: 'Monthly Expenses', monthly: Number(data.monthlyExpenses) || 0 }],
    team: teamEntries.length ? teamEntries : undefined,
    intake_responses: [
      { question: 'What brings you to Acorn Care', answer: data.whatBringsYou },
      { question: 'What brings you (options)', answer: (data.whatBringsYouOptions || []).join(', ') },
      { question: 'Completing as', answer: [data.completingAs, data.completingAsOther].filter(Boolean).join(' — ') },
      { question: 'Relationship to client', answer: data.relationshipToClient },
      { question: 'Who to contact', answer: data.contactWho },
      { question: 'Goal urgency', answer: data.goalUrgency },
      { question: 'DOB', answer: data.dob },
      { question: 'Spouse DOB', answer: data.spouseDob },
      { question: 'Phone', answer: data.phone },
      { question: 'Address', answer: data.address },
      { question: 'Dependents', answer: dependentsSummary },
      { question: 'Planning involvement', answer: planningInvolvement.join(', ') },
      { question: 'Financial picture method', answer: data.financialPictureMethod },
      { question: 'Financial clarity', answer: data.financialClarity },
      { question: 'Risk tolerance', answer: data.risk },
      { question: 'Has Will', answer: data.hasWill },
      { question: 'Has Trust', answer: data.hasTrust },
      { question: 'Has POA', answer: data.hasPOA },
      { question: 'Has Healthcare Directive', answer: data.hasHealthcareDirective },
      { question: 'Has Beneficiary Designations', answer: data.hasBeneficiaryDesignations },
      { question: 'Has Life Insurance', answer: data.hasLifeIns },
      { question: 'Has LTC Insurance', answer: data.hasLTCIns },
      { question: 'Has Disability Insurance', answer: data.hasDisabilityIns },
      { question: 'Has Property Insurance', answer: data.hasPropertyIns },
      { question: 'Estate Plan Notes', answer: data.estatePlanNotes },
      { question: 'Document upload preference', answer: data.docUploadPreference },
      { question: 'Largest obstacle', answer: data.largestObstacle },
      { question: 'Review with Acorn sections', answer: reviewWithAcornSections.join(', ') },
      { question: 'Help call requested', answer: data.helpRequested ? `Yes — ${data.helpRequestSection || 'unspecified'}` : 'No' },
    ].filter((r) => r.answer),
    intake_form_data: formDataToStore,
    intake_submitted_at: new Date().toISOString(),
    intake_completion_pct: 100,
    status: 'Review',
    review_with_acorn_sections: reviewWithAcornSections,
  }

  if (data.helpRequested) {
    clientPayload.help_requested = true
    clientPayload.help_request_section = data.helpRequestSection || null
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
    await sendIntakeCompletionEmail(clientName, clientEmail, clientId || undefined)
    await sendIntakeConfirmationEmail(clientName, clientEmail)
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/clients')
  return { success: true, clientId }
}

'use server'

import { createServiceRoleClient } from '@/utils/supabase/service'
import { sendIntakeInvite, sendIntakeReminder, sendBookingInviteEmail } from '@/lib/resend'
import { revalidatePath } from 'next/cache'

export async function inviteClient(formData: FormData) {
  const name = String(formData.get('name') || '').trim()
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const phone = String(formData.get('phone') || '').trim()
  const plan = String(formData.get('plan') || 'Intake').trim() as
    | 'Royal Oak'
    | 'Sycamore'
    | 'Mahogany'
    | 'Intake'

  if (!name || !email) {
    return { success: false, error: 'Name and email are required' }
  }

  const supabase = createServiceRoleClient()

  // Check for existing client by email
  const { data: existing } = await supabase
    .from('clients')
    .select('id, intake_token, name')
    .eq('email', email)
    .maybeSingle()

  let clientId: string
  let token: string
  let clientName: string

  if (existing) {
    clientId = existing.id
    token = existing.intake_token
    clientName = existing.name
    const updates: any = { intake_invited_at: new Date().toISOString() }
    if (phone) updates.phone = phone
    await supabase
      .from('clients')
      .update(updates)
      .eq('id', clientId)
  } else {
    // Seed the intake form data so the form is prefilled when the client opens it
    const seedFormData = {
      // About you
      clientName: name,
      email,
      phone,
      dob: '',
      address: '',
      completingAs: '',
      completingAsOther: '',
      relationshipToClient: '',
      contactWho: '',
      // What brings you
      whatBringsYou: '',
      whatBringsYouOptions: [],
      // Goals
      goals: '',
      goalsSelected: [],
      goalUrgency: '',
      largestObstacle: '',
      // Family / dependents
      spouseName: '',
      spouseDob: '',
      children: '',
      dependentsSelected: [],
      planningInvolvement: [],
      // Professional team
      professionalTeam: {
        cpa: { name: '', firm: '', email: '', contactPermission: '', dontHave: false },
        estateAttorney: { name: '', firm: '', email: '', contactPermission: '', dontHave: false },
        financialAdvisor: { name: '', firm: '', email: '', contactPermission: '', dontHave: false },
        insuranceAgent: { name: '', firm: '', email: '', contactPermission: '', dontHave: false },
        banker: { name: '', firm: '', email: '', contactPermission: '', dontHave: false },
        businessAttorney: { name: '', firm: '', email: '', contactPermission: '', dontHave: false },
        other: { role: '', name: '', firm: '', email: '', contactPermission: '', dontHave: false },
      },
      // Assets & liabilities
      assetTypes: [],
      assets: [{ label: '', value: '', category: 'Cash' }],
      liabilityTypes: [],
      liabilities: [{ label: '', balance: '', rate: '' }],
      noLiabilities: false,
      // Income & expenses
      annualIncome: '',
      monthlyExpenses: '',
      financialPictureMethod: '',
      financialClarity: '',
      // Risk
      risk: '',
      // Estate & insurance
      hasWill: '',
      hasTrust: '',
      hasPOA: '',
      hasHealthcareDirective: '',
      hasBeneficiaryDesignations: '',
      hasLifeIns: '',
      hasLTCIns: '',
      hasDisabilityIns: '',
      hasPropertyIns: '',
      estatePlanNotes: '',
      // Documents
      docUploadPreference: '',
      docAcknowledged: false,
      documentStatuses: {},
      // Help & review flags
      helpRequested: false,
      helpRequestSection: '',
      reviewWithAcornSections: [],
      // Terms
      termsAgreed: false,
    }
    const { data: created, error } = await supabase
      .from('clients')
      .insert({
        name,
        email,
        phone: phone || null,
        plan,
        status: 'Onboarding',
        intake_invited_at: new Date().toISOString(),
        intake_form_data: seedFormData,
      })
      .select('id, intake_token')
      .single()

    if (error || !created) {
      return { success: false, error: error?.message || 'Failed to create client' }
    }
    clientId = created.id
    token = created.intake_token
    clientName = name
  }

  const result = await sendIntakeInvite(clientName, email, token)
  if (!result.success) {
    const errMsg = (result.error as any)?.message || (result.error as any)?.name || JSON.stringify(result.error)
    console.error('[inviteClient] Resend error:', result.error)
    return { success: false, error: `Email failed: ${errMsg}` }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/clients')
  return { success: true, clientId }
}

export async function sendReminder(clientId: string) {
  const supabase = createServiceRoleClient()
  const { data: client, error } = await supabase
    .from('clients')
    .select('id, name, email, intake_token, intake_reminders_sent')
    .eq('id', clientId)
    .single()

  if (error || !client) {
    return { success: false, error: 'Client not found' }
  }

  const result = await sendIntakeReminder(client.name, client.email, client.intake_token)
  if (!result.success) {
    return { success: false, error: 'Email failed to send' }
  }

  await supabase
    .from('clients')
    .update({
      intake_reminders_sent: (client.intake_reminders_sent || 0) + 1,
      intake_last_reminder_at: new Date().toISOString(),
    })
    .eq('id', clientId)

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/clients')
  return { success: true }
}

// Admin (Karli) approves a submitted intake → emails the client a Calendly booking link.
export async function approveIntake(clientId: string) {
  const supabase = createServiceRoleClient()
  const { data: client, error } = await supabase
    .from('clients')
    .select('id, name, email, intake_submitted_at')
    .eq('id', clientId)
    .single()

  if (error || !client) {
    return { success: false, error: 'Client not found' }
  }
  if (!client.intake_submitted_at) {
    return { success: false, error: 'Intake has not been submitted yet' }
  }

  const result = await sendBookingInviteEmail(client.name, client.email)
  if (!result.success) {
    const errMsg = (result.error as any)?.message || (result.error as any)?.name || JSON.stringify(result.error)
    console.error('[approveIntake] Resend error:', result.error)
    return { success: false, error: `Email failed: ${errMsg}` }
  }

  await supabase
    .from('clients')
    .update({ intake_approved_at: new Date().toISOString() })
    .eq('id', clientId)

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/clients')
  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true }
}

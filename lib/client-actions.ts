'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createClientProfile(formData: FormData) {
  const first = String(formData.get('firstName') || '').trim()
  const last = String(formData.get('lastName') || '').trim()
  const name = `${first} ${last}`.trim()
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const phone = String(formData.get('phone') || '').trim() || null
  const plan = String(formData.get('plan') || 'Intake').trim()
  const status = String(formData.get('status') || 'Active').trim()
  const notes = String(formData.get('notes') || '').trim() || null

  if (!name || !email) return { success: false, error: 'Name and email are required' }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('clients')
    .insert({ name, email, phone, plan, status, notes })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[createClientProfile]', error)
    return { success: false, error: error?.message || 'Failed to create client' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/clients')
  return { success: true, clientId: data.id }
}

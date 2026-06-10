'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateClientGoals(clientId: string, goals: string[]) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('clients')
    .update({ goals })
    .eq('id', clientId)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/dashboard/clients/${clientId}`)
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateClientNotes(clientId: string, notes: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('clients')
    .update({ notes })
    .eq('id', clientId)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true }
}

export async function updateMeetingNotes(clientId: string, notes: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('clients')
    .update({ meeting_notes: notes })
    .eq('id', clientId)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true }
}

export async function updateReminders(clientId: string, reminders: { id: string; date: string; label: string }[]) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('clients')
    .update({ reminders })
    .eq('id', clientId)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true }
}

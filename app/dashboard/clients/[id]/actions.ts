'use server'

import { createServiceRoleClient } from '@/utils/supabase/service'
import { revalidatePath } from 'next/cache'

export async function updateClientGoals(clientId: string, goals: string[]) {
  const supabase = createServiceRoleClient()
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
  const supabase = createServiceRoleClient()
  const { error } = await supabase
    .from('clients')
    .update({ notes })
    .eq('id', clientId)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true }
}

export async function updateMeetingNotes(clientId: string, notes: string) {
  const supabase = createServiceRoleClient()
  const { error } = await supabase
    .from('clients')
    .update({ meeting_notes: notes })
    .eq('id', clientId)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true }
}

type AssetInput = { id?: string; label: string; value: number; category: string }
type LiabilityInput = { id?: string; label: string; balance: number; rate?: number | null }

// Sync the client's assets + liabilities from the editable Net Worth card.
// Updates only the editable fields (label/value/category/balance/rate) on existing
// rows, so backfilled metadata (institution, account_type, owner, purchase_amount, …)
// is preserved. New rows are inserted; removed rows are deleted.
export async function saveNetWorth(
  clientId: string,
  assets: AssetInput[],
  liabilities: LiabilityInput[],
  deletedAssetIds: string[],
  deletedLiabilityIds: string[],
) {
  const supabase = createServiceRoleClient()
  const errors: string[] = []

  if (deletedAssetIds.length) {
    const { error } = await supabase.from('assets').delete().in('id', deletedAssetIds)
    if (error) errors.push(error.message)
  }
  if (deletedLiabilityIds.length) {
    const { error } = await supabase.from('liabilities').delete().in('id', deletedLiabilityIds)
    if (error) errors.push(error.message)
  }

  for (const a of assets) {
    if (!a.label?.trim()) continue
    if (a.id) {
      const { error } = await supabase.from('assets')
        .update({ label: a.label.trim(), value: a.value, category: a.category })
        .eq('id', a.id)
      if (error) errors.push(error.message)
    } else {
      const { error } = await supabase.from('assets')
        .insert({ client_id: clientId, label: a.label.trim(), value: a.value, category: a.category, source: 'Manual' })
      if (error) errors.push(error.message)
    }
  }

  for (const l of liabilities) {
    if (!l.label?.trim()) continue
    if (l.id) {
      const { error } = await supabase.from('liabilities')
        .update({ label: l.label.trim(), balance: l.balance, rate: l.rate ?? null })
        .eq('id', l.id)
      if (error) errors.push(error.message)
    } else {
      const { error } = await supabase.from('liabilities')
        .insert({ client_id: clientId, label: l.label.trim(), balance: l.balance, rate: l.rate ?? null, source: 'Manual' })
      if (error) errors.push(error.message)
    }
  }

  if (errors.length) return { success: false, error: errors.join('; ') }
  revalidatePath(`/dashboard/clients/${clientId}`)
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateReminders(clientId: string, reminders: { id: string; date: string; label: string }[]) {
  const supabase = createServiceRoleClient()
  const { error } = await supabase
    .from('clients')
    .update({ reminders })
    .eq('id', clientId)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true }
}

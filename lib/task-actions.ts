'use server'

import { createServiceRoleClient } from '@/utils/supabase/service'
import { sendTaskReminderEmail } from '@/lib/resend'
import { revalidatePath } from 'next/cache'

// Karli manually creates a to-do task for a client (e.g. "Send in 2026 tax returns").
export async function createTask(
  clientId: string,
  title: string,
  opts?: { dueDate?: string | null; owner?: 'Karli' | 'Client' }
) {
  const cleanTitle = (title || '').trim()
  if (!clientId || !cleanTitle) {
    return { success: false, error: 'Title is required' }
  }

  const supabase = createServiceRoleClient()
  const { data, error } = await supabase
    .from('action_items')
    .insert({
      client_id: clientId,
      title: cleanTitle,
      due_date: opts?.dueDate || null,
      status: 'open',
      owner: opts?.owner || 'Client',
    })
    .select('id, title, due_date, status, owner, source_meeting')
    .single()

  if (error || !data) {
    console.error('[createTask] error:', error)
    return { success: false, error: error?.message || 'Failed to create task' }
  }

  revalidatePath(`/dashboard/clients/${clientId}`)
  revalidatePath('/dashboard')
  return { success: true, task: data }
}

// Toggle a task between open and done (wires up the existing checkbox).
export async function setTaskStatus(clientId: string, taskId: string, done: boolean) {
  const supabase = createServiceRoleClient()
  const { error } = await supabase
    .from('action_items')
    .update({ status: done ? 'done' : 'open', updated_at: new Date().toISOString() })
    .eq('id', taskId)

  if (error) {
    console.error('[setTaskStatus] error:', error)
    return { success: false, error: error.message }
  }
  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true }
}

// Email the client a reminder for a specific task.
export async function sendTaskReminder(clientId: string, taskId: string) {
  const supabase = createServiceRoleClient()
  const { data: client, error: clientErr } = await supabase
    .from('clients')
    .select('id, name, email')
    .eq('id', clientId)
    .single()
  if (clientErr || !client) return { success: false, error: 'Client not found' }
  if (!client.email) return { success: false, error: 'Client has no email on file' }

  const { data: task, error: taskErr } = await supabase
    .from('action_items')
    .select('id, title')
    .eq('id', taskId)
    .single()
  if (taskErr || !task) return { success: false, error: 'Task not found' }

  const result = await sendTaskReminderEmail(client.name, client.email, task.title)
  if (!result.success) {
    const errMsg = (result.error as any)?.message || (result.error as any)?.name || JSON.stringify(result.error)
    console.error('[sendTaskReminder] Resend error:', result.error)
    return { success: false, error: `Email failed: ${errMsg}` }
  }

  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true }
}

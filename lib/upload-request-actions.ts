'use server'

import { createServiceRoleClient } from '@/utils/supabase/service'
import { sendDocumentUploadRequestEmail } from '@/lib/resend'
import { revalidatePath } from 'next/cache'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://acorn-cockpit.onrender.com'

// Generate a token, persist it, and email the client their upload link.
export async function createUploadRequest(
  clientId: string,
  clientName: string,
  clientEmail: string,
  note?: string,
): Promise<{ success: boolean; error?: string; link?: string }> {
  if (!clientEmail) return { success: false, error: 'Client has no email on file' }

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('upload_requests')
    .insert({
      client_id: clientId,
      note: note?.trim() || null,
    })
    .select('token')
    .single()

  if (error || !data) {
    console.error('[createUploadRequest] DB error:', error)
    return { success: false, error: error?.message || 'Failed to create upload request' }
  }

  const link = `${SITE}/documents?token=${data.token}`

  const emailRes = await sendDocumentUploadRequestEmail(clientName, clientEmail, link, note)
  if (!emailRes.success) {
    console.error('[createUploadRequest] Email error:', emailRes.error)
    // Token is already saved — Karli can still copy the link manually
    return { success: true, link, error: 'Email failed to send — copy the link below to share manually.' }
  }

  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true, link }
}

// Validate a token on the client upload page — returns client info if valid.
export async function getUploadRequestByToken(token: string) {
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('upload_requests')
    .select('id, client_id, note, expires_at, used_at, clients(id, name, email)')
    .eq('token', token)
    .maybeSingle()

  if (error || !data) return null

  // Reject expired or already-used tokens
  if (new Date(data.expires_at) < new Date()) return null
  if (data.used_at) return null

  return data
}

// Mark the token as used once the client submits their documents.
export async function markUploadRequestUsed(token: string) {
  const supabase = createServiceRoleClient()
  await supabase
    .from('upload_requests')
    .update({ used_at: new Date().toISOString() })
    .eq('token', token)
}

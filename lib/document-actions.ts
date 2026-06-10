'use server'

import { createServiceRoleClient } from '@/utils/supabase/service'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'

const BUCKET = 'client-documents'

// ─── Upload a file to Storage + record in documents table ───────────────────
export async function uploadDocument(
  clientId: string,
  formData: FormData,
): Promise<{ success: boolean; error?: string; documentId?: string }> {
  const file = formData.get('file') as File | null
  const tag = (formData.get('tag') as string | null) || 'Other'
  const uploadedBy = (formData.get('uploadedBy') as string | null) || 'karli'

  if (!file || file.size === 0) return { success: false, error: 'No file provided' }
  if (file.size > 52_428_800) return { success: false, error: 'File exceeds 50 MB limit' }

  const supabase = createServiceRoleClient()

  // Build a collision-free storage path namespaced to the client
  const ext = file.name.split('.').pop() ?? ''
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const storagePath = `clients/${clientId}/${randomUUID()}_${safeName}`

  // Convert File → ArrayBuffer for upload
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    return { success: false, error: uploadError.message }
  }

  // Insert metadata row
  const { data, error: dbError } = await supabase
    .from('documents')
    .insert({
      client_id: clientId,
      name: file.name,
      storage_path: storagePath,
      tag,
      size_bytes: file.size,
      source: uploadedBy === 'karli' ? 'Karli upload' : 'Client upload',
      uploaded_by: uploadedBy,
      uploaded_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (dbError) {
    // Upload succeeded but DB insert failed — clean up the orphaned file
    console.error('DB insert error (cleaning up storage):', dbError)
    await supabase.storage.from(BUCKET).remove([storagePath])
    return { success: false, error: dbError.message }
  }

  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true, documentId: data.id }
}

// ─── Generate a short-lived signed URL for viewing a document ───────────────
export async function getDocumentSignedUrl(
  storagePath: string,
  expiresInSeconds = 3600,
): Promise<{ url: string | null; error?: string }> {
  if (!storagePath) return { url: null, error: 'No storage path' }

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, expiresInSeconds)

  if (error) {
    console.error('Signed URL error:', error)
    return { url: null, error: error.message }
  }

  return { url: data.signedUrl }
}

// ─── Delete a document from Storage + remove its DB row ─────────────────────
export async function deleteDocument(
  clientId: string,
  documentId: string,
  storagePath: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServiceRoleClient()

  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([storagePath])

  if (storageError) {
    console.error('Storage delete error:', storageError)
    return { success: false, error: storageError.message }
  }

  const { error: dbError } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId)

  if (dbError) {
    console.error('DB delete error:', dbError)
    return { success: false, error: dbError.message }
  }

  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true }
}

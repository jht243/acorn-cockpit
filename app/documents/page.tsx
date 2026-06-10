import { getUploadRequestByToken } from '@/lib/upload-request-actions'
import DocumentsUploadClient from './DocumentsUploadClient'

export const dynamic = 'force-dynamic'

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) return <InvalidToken reason="missing" />

  const request = await getUploadRequestByToken(token)

  if (!request) return <InvalidToken reason="invalid" />

  const client = (Array.isArray(request.clients) ? request.clients[0] : request.clients) as { id: string; name: string; email: string } | null
  if (!client) return <InvalidToken reason="invalid" />

  return (
    <DocumentsUploadClient
      token={token}
      clientId={client.id}
      clientName={client.name}
      note={request.note || undefined}
    />
  )
}

function InvalidToken({ reason }: { reason: 'missing' | 'invalid' }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="card card-pad max-w-md w-full text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-red-50 mx-auto flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2 className="text-base font-semibold">
          {reason === 'missing' ? 'No upload link found' : 'This link is invalid or has expired'}
        </h2>
        <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
          {reason === 'missing'
            ? 'Please use the link that was emailed to you by Karli.'
            : 'This link may have already been used, or it has expired after 30 days. Contact Karli to request a new one.'}
        </p>
        <a
          href="mailto:karli@acorncare.com"
          className="btn inline-flex justify-center"
        >
          Contact Karli
        </a>
      </div>
    </div>
  )
}

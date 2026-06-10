'use client'

import { useState } from 'react'
import { getDocumentSignedUrl } from '@/lib/document-actions'

export default function ViewDocumentButton({ storagePath }: { storagePath: string | null | undefined }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  // No storage path = legacy/mock document, nothing to open
  if (!storagePath) {
    return (
      <span className="text-xs" style={{ color: 'var(--ink-soft)' }} title="No file stored yet">
        —
      </span>
    )
  }

  const open = async () => {
    setLoading(true)
    setError(false)
    const { url, error: err } = await getDocumentSignedUrl(storagePath)
    setLoading(false)

    if (err || !url) {
      setError(true)
      setTimeout(() => setError(false), 3000)
      return
    }

    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (error) {
    return <span className="text-xs" style={{ color: 'var(--danger)' }}>Error — retry</span>
  }

  return (
    <button
      className="text-xs shrink-0 flex items-center gap-1"
      style={{ color: loading ? 'var(--ink-soft)' : 'var(--brand)' }}
      disabled={loading}
      onClick={open}
    >
      {loading ? (
        <>
          <svg className="animate-spin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          opening…
        </>
      ) : (
        'view'
      )}
    </button>
  )
}

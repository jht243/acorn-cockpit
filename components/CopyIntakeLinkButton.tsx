'use client'

import { useState } from 'react'

export default function CopyIntakeLinkButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false)

  const onClick = () => {
    const link = `${window.location.origin}/intake?token=${token}`
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    })
  }

  return (
    <button
      onClick={onClick}
      title={copied ? 'Link copied!' : 'Share Intake Form Link'}
      aria-label="Share Intake Form Link"
      className="w-9 h-9 inline-flex items-center justify-center rounded-md border hover:bg-[var(--brand-soft)] transition-colors"
      style={{ borderColor: 'var(--line)' }}
    >
      {copied ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--brand)' }}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ink-soft)' }}>
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  )
}

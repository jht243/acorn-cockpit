'use client'

import { useState } from 'react'

export default function CopyIntakeLinkButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false)

  const onClick = () => {
    const link = `${window.location.origin}/intake?token=${token}`
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button onClick={onClick} className="btn-ghost btn">
      {copied ? '✓ Link copied' : 'Copy intake link'}
    </button>
  )
}

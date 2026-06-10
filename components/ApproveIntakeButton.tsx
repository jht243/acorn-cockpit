'use client'

import { useState, useTransition } from 'react'
import { approveIntake } from '@/lib/intake-actions'

export default function ApproveIntakeButton({ clientId, approvedAt }: { clientId: string; approvedAt?: string | null }) {
  const [pending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle')
  const [justApproved, setJustApproved] = useState(false)

  const onClick = () => {
    setStatus('idle')
    startTransition(async () => {
      const res = await approveIntake(clientId)
      setStatus(res.success ? 'sent' : 'error')
      if (res.success) {
        setJustApproved(true)
        setTimeout(() => setStatus('idle'), 2500)
      }
    })
  }

  const alreadyApproved = !!approvedAt || justApproved

  if (status === 'sent') {
    return <span className="pill pill-green">✓ Booking invite sent</span>
  }

  if (alreadyApproved) {
    return (
      <span className="flex items-center gap-2">
        <span className="pill pill-green" title={approvedAt ? `Approved ${new Date(approvedAt).toLocaleDateString()}` : undefined}>✓ Intake approved</span>
        <button onClick={onClick} disabled={pending} className="text-xs font-medium hover:underline" style={{ color: 'var(--brand)' }}>
          {pending ? 'Sending…' : 'Resend booking link'}
        </button>
      </span>
    )
  }

  if (status === 'error') {
    return <button onClick={onClick} className="btn" style={{ background: 'var(--danger)' }}>Failed — retry approve</button>
  }

  return (
    <button onClick={onClick} disabled={pending} className="btn">
      {pending ? 'Sending booking link…' : 'Approve intake'}
    </button>
  )
}

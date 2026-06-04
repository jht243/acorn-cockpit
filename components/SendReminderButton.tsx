'use client'

import { useState, useTransition } from 'react'
import { sendReminder } from '@/lib/intake-actions'

export default function SendReminderButton({ clientId, lastReminderAt, remindersSent }: { clientId: string; lastReminderAt?: string | null; remindersSent?: number }) {
  const [pending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle')

  const onClick = () => {
    setStatus('idle')
    startTransition(async () => {
      const res = await sendReminder(clientId)
      setStatus(res.success ? 'sent' : 'error')
      if (res.success) setTimeout(() => setStatus('idle'), 2500)
    })
  }

  if (status === 'sent') {
    return <span className="text-xs font-medium" style={{ color: 'var(--brand)' }}>✓ Reminder sent</span>
  }
  if (status === 'error') {
    return <button onClick={onClick} className="text-xs font-medium" style={{ color: 'var(--danger)' }}>Failed — retry</button>
  }
  return (
    <button onClick={onClick} disabled={pending} className="text-xs font-medium hover:underline" style={{ color: 'var(--brand)' }}>
      {pending ? 'Sending…' : remindersSent && remindersSent > 0 ? `Send reminder (${remindersSent} sent)` : 'Send reminder'}
    </button>
  )
}

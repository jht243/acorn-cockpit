'use client'

import { useState, useTransition } from 'react'
import { inviteClient } from '@/lib/intake-actions'

export default function InviteClientButton({ label = '+ Send intake link', className = 'btn' }: { label?: string; className?: string }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [status, setStatus] = useState<{ kind: 'idle' | 'success' | 'error'; msg?: string }>({ kind: 'idle' })

  const submit = (formData: FormData) => {
    setStatus({ kind: 'idle' })
    const first = String(formData.get('firstName') || '').trim()
    const last = String(formData.get('lastName') || '').trim()
    formData.set('name', `${first} ${last}`.trim())
    startTransition(async () => {
      const res = await inviteClient(formData)
      if (res.success) {
        setStatus({ kind: 'success', msg: `Intake link sent! They'll appear on your dashboard.` })
        setTimeout(() => {
          setOpen(false)
          setStatus({ kind: 'idle' })
        }, 1800)
      } else {
        setStatus({ kind: 'error', msg: res.error || 'Something went wrong' })
      }
    })
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {label}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => !pending && setOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold tracking-tight mb-1">Invite a new client</h2>
            <p className="text-sm mb-5" style={{ color: 'var(--ink-soft)' }}>
              They&apos;ll get an email with a secure link to complete their intake form. You&apos;ll see their progress here.
            </p>
            <form action={submit} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">First name</label>
                  <input name="firstName" required placeholder="Jane" className="input w-full" autoFocus />
                </div>
                <div>
                  <label className="label">Last name</label>
                  <input name="lastName" required placeholder="Doe" className="input w-full" />
                </div>
              </div>
              <div>
                <label className="label">Client email</label>
                <input name="email" type="email" required placeholder="jane@example.com" className="input w-full" />
              </div>
              <div>
                <label className="label">Plan tier (you can change later)</label>
                <select name="plan" defaultValue="Intake" className="select w-full">
                  <option value="Intake">Will determine later</option>
                  <option value="Royal Oak">Royal Oak</option>
                  <option value="Sycamore">Sycamore</option>
                  <option value="Mahogany">Mahogany</option>
                </select>
              </div>
              {status.kind === 'success' && (
                <div className="text-sm bg-green-50 text-green-800 p-2 rounded border border-green-100">{status.msg}</div>
              )}
              {status.kind === 'error' && (
                <div className="text-sm bg-red-50 text-red-700 p-2 rounded border border-red-100">{status.msg}</div>
              )}
              <div className="flex gap-2 mt-3">
                <button type="button" className="btn-ghost btn flex-1 justify-center" onClick={() => setOpen(false)} disabled={pending}>
                  Cancel
                </button>
                <button type="submit" className="btn flex-1 justify-center" disabled={pending}>
                  {pending ? 'Sending…' : 'Send intake link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

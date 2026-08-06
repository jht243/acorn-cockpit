'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClientProfile } from '@/lib/client-actions'

export default function AddClientButton() {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const submit = (formData: FormData) => {
    setError(null)
    startTransition(async () => {
      const res = await createClientProfile(formData)
      if (res.success && res.clientId) {
        setOpen(false)
        router.push(`/dashboard/clients/${res.clientId}`)
      } else {
        setError(res.error || 'Something went wrong')
      }
    })
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn !px-2.5 sm:!px-3.5" title="Add client" aria-label="Add client">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
        <span className="hidden sm:inline">Add client</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => !pending && setOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold tracking-tight mb-1">Add a client</h2>
            <p className="text-sm mb-5" style={{ color: 'var(--ink-soft)' }}>
              Creates a profile immediately — no email sent. You can send them an intake link from their profile whenever you're ready.
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
                <label className="label">Email</label>
                <input name="email" type="email" required placeholder="jane@example.com" className="input w-full" />
              </div>
              <div>
                <label className="label">Phone (optional)</label>
                <input name="phone" type="tel" placeholder="305-555-1234" className="input w-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Plan tier</label>
                  <select name="plan" defaultValue="Intake" className="select w-full">
                    <option value="Intake">TBD</option>
                    <option value="Royal Oak">Royal Oak</option>
                    <option value="Sycamore">Sycamore</option>
                    <option value="Mahogany">Mahogany</option>
                  </select>
                </div>
                <div>
                  <label className="label">Status</label>
                  <select name="status" defaultValue="Active" className="select w-full">
                    <option value="Active">Active</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Review">Review</option>
                    <option value="Follow-Up">Follow-Up</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Notes (optional)</label>
                <textarea name="notes" className="textarea" rows={2} placeholder="e.g., Referred by Anita Reyes, met at event…" />
              </div>
              {error && (
                <div className="text-sm bg-red-50 text-red-700 p-2 rounded border border-red-100">{error}</div>
              )}
              <div className="flex gap-2 mt-1">
                <button type="button" className="btn-ghost btn flex-1 justify-center" onClick={() => setOpen(false)} disabled={pending}>
                  Cancel
                </button>
                <button type="submit" className="btn flex-1 justify-center" disabled={pending}>
                  {pending ? 'Creating…' : 'Create profile →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

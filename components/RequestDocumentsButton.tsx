'use client'

import { useState } from 'react'
import { createUploadRequest } from '@/lib/upload-request-actions'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function RequestDocumentsButton({
  clientId,
  clientName,
  clientEmail,
}: {
  clientId: string
  clientName: string
  clientEmail?: string | null
}) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')

  const close = () => {
    if (status === 'sending') return
    setOpen(false)
    setTimeout(() => { setStatus('idle'); setNote(''); setErrorMsg(''); setGeneratedLink('') }, 200)
  }

  const send = async () => {
    setStatus('sending')
    setErrorMsg('')
    const res = await createUploadRequest(clientId, clientName, clientEmail || '', note)
    if (res.link) setGeneratedLink(res.link)
    if (!res.success) {
      setStatus('error')
      setErrorMsg(res.error || 'Something went wrong')
      return
    }
    // success — even if email failed we still have the link
    setStatus('sent')
    if (res.error) setErrorMsg(res.error) // soft warning (email failed but link saved)
  }

  const firstName = clientName.split(' ')[0]

  return (
    <>
      <button className="btn-ghost btn text-xs normal-case" onClick={() => setOpen(true)}>
        Request documents
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={close}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {status !== 'sent' ? (
              <>
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Request documents</h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--ink-soft)' }}>
                    Sends {firstName} a secure upload link by email. Expires in 30 days.
                  </p>
                </div>

                {/* To: */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-md border text-sm" style={{ borderColor: 'var(--line)', background: '#f9fbfa' }}>
                  <span className="font-medium" style={{ color: 'var(--ink-soft)' }}>To:</span>
                  {clientEmail
                    ? <span>{clientName} &lt;{clientEmail}&gt;</span>
                    : <span className="text-red-600">No email on file — add one to the profile first.</span>
                  }
                </div>

                {/* Optional note */}
                <div>
                  <label className="label">Message to {firstName} (optional)</label>
                  <textarea
                    className="textarea w-full"
                    rows={3}
                    placeholder={`I'd like to collect a few documents from you. Please use the secure link below to upload them at your convenience.`}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <p className="text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>
                    Leave blank to use the default message.
                  </p>
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-600">{errorMsg}</p>
                )}

                <div className="flex gap-2">
                  <button className="btn-ghost btn flex-1 justify-center" disabled={status === 'sending'} onClick={close}>
                    Cancel
                  </button>
                  <button
                    className="btn flex-1 justify-center"
                    disabled={status === 'sending' || !clientEmail}
                    style={(!clientEmail) ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    onClick={send}
                  >
                    {status === 'sending' ? 'Sending…' : 'Send link →'}
                  </button>
                </div>
              </>
            ) : (
              /* ── Success state ── */
              <>
                <div className="text-center py-2">
                  <div className="w-12 h-12 rounded-full bg-[var(--brand-soft)] mx-auto flex items-center justify-center mb-3">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5"><path d="M5 12l5 5L20 6"/></svg>
                  </div>
                  <h2 className="text-base font-semibold">Link sent to {firstName}</h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--ink-soft)' }}>
                    They'll receive an email with a secure upload link, valid for 30 days.
                  </p>
                </div>

                {/* Show link in case Karli wants to copy it manually */}
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color: 'var(--ink-soft)' }}>Upload link (copy to share manually)</div>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      className="input flex-1 text-xs"
                      value={generatedLink}
                      onFocus={(e) => e.target.select()}
                    />
                    <button
                      className="btn-ghost btn text-xs shrink-0"
                      onClick={() => navigator.clipboard.writeText(generatedLink)}
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs" style={{ color: '#b45309' }}>{errorMsg}</p>
                )}

                <button className="btn w-full justify-center" onClick={close}>Done</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

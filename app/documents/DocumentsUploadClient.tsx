'use client'

import { useState, useRef } from 'react'
import { uploadDocument } from '@/lib/document-actions'
import { markUploadRequestUsed } from '@/lib/upload-request-actions'

const TAGS = ['Tax', 'Statements', 'Estate', 'Insurance', 'Lending', 'Income', 'Business', 'Other']

const TAG_COLORS: Record<string, { bg: string; fg: string }> = {
  Tax:        { bg: '#fff7e6', fg: '#b45309' },
  Statements: { bg: '#e8f0fe', fg: '#1a73e8' },
  Estate:     { bg: '#f4faf5', fg: '#1f5a39' },
  Insurance:  { bg: '#fce8e6', fg: '#c5221f' },
  Lending:    { bg: '#fef3c7', fg: '#92400e' },
  Income:     { bg: '#f0fdf4', fg: '#166534' },
  Business:   { bg: '#f5f3ff', fg: '#5b21b6' },
  Other:      { bg: '#f0f0f0', fg: '#555' },
}

type QueuedFile = { file: File; tag: string; status: 'pending' | 'uploading' | 'done' | 'error'; error?: string }

const fmt = (bytes: number) =>
  bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`

export default function DocumentsUploadClient({
  token,
  clientId,
  clientName,
  note,
}: {
  token: string
  clientId: string
  clientName: string
  note?: string
}) {
  const [queue, setQueue] = useState<QueuedFile[]>([])
  const [activeTag, setActiveTag] = useState('Tax')
  const [dragOver, setDragOver] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addFiles = (files: File[]) => {
    const valid = files.filter((f) => f.size <= 52_428_800)
    setQueue((q) => [...q, ...valid.map((f) => ({ file: f, tag: activeTag, status: 'pending' as const }))])
  }

  const removeFile = (i: number) => setQueue((q) => q.filter((_, j) => j !== i))
  const updateTag = (i: number, tag: string) => setQueue((q) => q.map((f, j) => j === i ? { ...f, tag } : f))

  const submit = async () => {
    if (queue.length === 0 || submitting) return
    setSubmitting(true)

    let anySucceeded = false

    for (let i = 0; i < queue.length; i++) {
      setQueue((q) => q.map((f, j) => j === i ? { ...f, status: 'uploading' } : f))

      const fd = new FormData()
      fd.append('file', queue[i].file)
      fd.append('tag', queue[i].tag)
      fd.append('uploadedBy', 'client')

      const res = await uploadDocument(clientId, fd)

      if (res.success) anySucceeded = true

      setQueue((q) => q.map((f, j) =>
        j === i
          ? { ...f, status: res.success ? 'done' : 'error', error: res.error }
          : f
      ))
    }

    setSubmitting(false)

    if (anySucceeded) {
      await markUploadRequestUsed(token)
      setSubmitted(true)
    }
  }

  const firstName = clientName.split(' ')[0]

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
        <div className="card card-pad max-w-md w-full text-center space-y-3 py-10">
          <div className="w-14 h-14 rounded-full bg-[var(--brand-soft)] mx-auto flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold tracking-tight">Documents received.</h2>
          <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
            Karli will review what you've uploaded and follow up if anything else is needed.
          </p>
          <div className="text-xs pt-2" style={{ color: 'var(--ink-soft)' }}>
            Acorn Care, LLC — Concierge Financial Coordination
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header className="bg-white border-b py-4 px-6 flex items-center justify-between" style={{ borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-2">
          <Logo />
          <div>
            <div className="text-sm font-semibold">Acorn Care</div>
            <div className="text-xs" style={{ color: 'var(--ink-soft)' }}>Concierge Financial Coordination</div>
          </div>
        </div>
        <div className="text-xs flex items-center gap-1.5" style={{ color: 'var(--ink-soft)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Secure upload · encrypted in transit
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-5">

        {/* Context card */}
        <div className="card card-pad">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--brand-soft)] text-[var(--brand-dark)] flex items-center justify-center font-semibold text-sm shrink-0">
              {clientName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <div className="text-sm font-semibold">{clientName} — document upload</div>
              <div className="text-xs" style={{ color: 'var(--ink-soft)' }}>Requested by Karli Vazquez-Mendez · Acorn Care</div>
            </div>
          </div>
          {note && (
            <div className="mt-3 pt-3 border-t text-sm" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
              {note}
            </div>
          )}
        </div>

        {/* Upload zone */}
        <div className="card">
          <div className="card-pad space-y-4">
            {/* Tag picker */}
            <div>
              <div className="text-sm font-semibold mb-2">Select a category for the next file(s)</div>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((t) => {
                  const c = TAG_COLORS[t]
                  const active = activeTag === t
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setActiveTag(t)}
                      className="py-1.5 px-3 rounded-full border text-sm font-medium transition-colors"
                      style={active
                        ? { background: c.bg, color: c.fg, borderColor: c.fg }
                        : { background: 'white', color: 'var(--ink-soft)', borderColor: 'var(--line)' }
                      }
                    >
                      {t}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Drop zone */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
              onChange={(e) => {
                if (e.target.files) addFiles(Array.from(e.target.files))
                e.target.value = ''
              }}
            />
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition"
              style={{ borderColor: dragOver ? 'var(--brand)' : 'var(--line)', background: dragOver ? 'var(--brand-soft)' : 'white' }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                addFiles(Array.from(e.dataTransfer.files))
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.5" className="mx-auto mb-2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/>
              </svg>
              <div className="text-sm font-medium">Click to upload, or drag & drop</div>
              <div className="text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>PDF, DOCX, XLSX, JPG, PNG · up to 50 MB each</div>
            </div>

            <div className="px-3 py-2 rounded-md border text-xs font-medium flex items-center gap-2" style={{ borderColor: '#f5c2c7', background: '#fff5f5', color: '#842029' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Please do not upload medical records.
            </div>
          </div>
        </div>

        {/* Queue */}
        {queue.length > 0 && (
          <div className="card">
            <div className="card-head">
              <span>Files to submit ({queue.length})</span>
            </div>
            <ul>
              {queue.map((item, i) => {
                const c = TAG_COLORS[item.tag]
                return (
                  <li key={i} className="px-5 py-3 border-t flex items-center gap-3" style={{ borderColor: 'var(--line)' }}>
                    <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold shrink-0" style={{ background: c.bg, color: c.fg }}>
                      {item.tag.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{item.file.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <select
                          className="text-xs border rounded px-1 py-0.5"
                          style={{ borderColor: 'var(--line)', color: c.fg, background: c.bg }}
                          value={item.tag}
                          disabled={item.status !== 'pending'}
                          onChange={(e) => updateTag(i, e.target.value)}
                        >
                          {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <span className="text-xs" style={{ color: 'var(--ink-soft)' }}>{fmt(item.file.size)}</span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {item.status === 'pending' && (
                        <button onClick={() => removeFile(i)} className="text-xs px-2 py-1 rounded hover:bg-red-50" style={{ color: 'var(--danger)' }}>Remove</button>
                      )}
                      {item.status === 'uploading' && (
                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      )}
                      {item.status === 'done' && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M5 12l5 5L20 6"/></svg>
                      )}
                      {item.status === 'error' && (
                        <span className="text-xs text-red-600">{item.error || 'Upload failed'}</span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
            You can always send more later — {firstName} will follow up if anything specific is needed.
          </p>
          <button
            className="btn shrink-0"
            disabled={queue.length === 0 || submitting}
            style={queue.length === 0 || submitting ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            onClick={submit}
          >
            {submitting ? 'Uploading…' : `Submit documents →`}
          </button>
        </div>

        <div className="text-center text-xs pb-6 flex items-center justify-center gap-4" style={{ color: 'var(--ink-soft)' }}>
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <span>·</span>
          <a href="/terms" className="hover:underline">Terms</a>
          <span>·</span>
          <a href="mailto:karli@acorncare.com" className="hover:underline">Contact Karli</a>
        </div>
      </div>
    </div>
  )
}

function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 6c-2 0-3 1-3 2v2h6V8c0-1-1-2-3-2z" fill="#c08a3e"/>
      <path d="M9 12h14c0 6-3 12-7 12s-7-6-7-12z" fill="#2f7d4f"/>
    </svg>
  )
}

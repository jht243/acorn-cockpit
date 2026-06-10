'use client'

import { useState, useRef } from 'react'
import { uploadDocument } from '@/lib/document-actions'

const TAGS = ['Tax', 'Statements', 'Estate', 'Insurance', 'Lending', 'Income', 'Business', 'Plan', 'Other']

const TAG_COLORS: Record<string, { bg: string; fg: string }> = {
  Tax:        { bg: '#fff7e6', fg: '#b45309' },
  Statements: { bg: '#e8f0fe', fg: '#1a73e8' },
  Estate:     { bg: '#f4faf5', fg: '#1f5a39' },
  Insurance:  { bg: '#fce8e6', fg: '#c5221f' },
  Lending:    { bg: '#fef3c7', fg: '#92400e' },
  Income:     { bg: '#f0fdf4', fg: '#166534' },
  Business:   { bg: '#f5f3ff', fg: '#5b21b6' },
  Plan:       { bg: '#e0f2fe', fg: '#0369a1' },
  Other:      { bg: '#f0f0f0', fg: '#555' },
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

export default function DocumentUploadButton({ clientId }: { clientId: string }) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [tag, setTag] = useState('Tax')
  const [dragOver, setDragOver] = useState(false)
  const [status, setStatus] = useState<UploadState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const reset = () => {
    setFile(null)
    setTag('Tax')
    setStatus('idle')
    setErrorMsg('')
    setDragOver(false)
  }

  const close = () => { reset(); setOpen(false) }

  const pickFile = (f: File) => {
    setFile(f)
    setStatus('idle')
    setErrorMsg('')
  }

  const submit = async () => {
    if (!file) return
    setStatus('uploading')
    setErrorMsg('')

    const fd = new FormData()
    fd.append('file', file)
    fd.append('tag', tag)
    fd.append('uploadedBy', 'karli')

    const res = await uploadDocument(clientId, fd)

    if (res.success) {
      setStatus('success')
      setTimeout(() => close(), 1400)
    } else {
      setStatus('error')
      setErrorMsg(res.error || 'Upload failed')
    }
  }

  const fmt = (bytes: number) =>
    bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`

  return (
    <>
      <button className="btn-ghost btn text-xs normal-case" onClick={() => setOpen(true)}>
        Upload
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => status !== 'uploading' && close()}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold tracking-tight">Upload document</h2>
              {status !== 'uploading' && (
                <button onClick={close} className="text-sm px-2 py-1 rounded hover:bg-gray-100" style={{ color: 'var(--ink-soft)' }}>✕</button>
              )}
            </div>

            {/* Tag picker */}
            <div>
              <label className="label">Category</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {TAGS.map((t) => {
                  const c = TAG_COLORS[t]
                  const active = tag === t
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTag(t)}
                      className="py-1 px-3 rounded-full border text-xs font-medium transition-colors"
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
            {!file ? (
              <label
                className="block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition"
                style={{ borderColor: dragOver ? 'var(--brand)' : 'var(--line)', background: dragOver ? 'var(--brand-soft)' : 'white' }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragOver(false)
                  const f = e.dataTransfer.files[0]
                  if (f) pickFile(f)
                }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) pickFile(f) }}
                />
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.5" className="mx-auto mb-2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/>
                </svg>
                <div className="text-sm font-medium">Click to upload, or drag & drop</div>
                <div className="text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>PDF, DOCX, XLSX, JPG, PNG · max 50 MB</div>
              </label>
            ) : (
              /* Selected file preview */
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg border" style={{ borderColor: 'var(--line)', background: '#f9fbfa' }}>
                <div
                  className="w-9 h-9 rounded flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: TAG_COLORS[tag].bg, color: TAG_COLORS[tag].fg }}
                >
                  {tag.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{file.name}</div>
                  <div className="text-xs" style={{ color: 'var(--ink-soft)' }}>{fmt(file.size)}</div>
                </div>
                {status === 'idle' && (
                  <button
                    onClick={() => { setFile(null); setStatus('idle') }}
                    className="text-xs px-2 py-1 rounded hover:bg-red-50 shrink-0"
                    style={{ color: 'var(--danger)' }}
                  >
                    Remove
                  </button>
                )}
                {status === 'uploading' && (
                  <svg className="animate-spin shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                )}
                {status === 'success' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" className="shrink-0">
                    <path d="M5 12l5 5L20 6"/>
                  </svg>
                )}
              </div>
            )}

            {errorMsg && (
              <p className="text-xs text-red-600">{errorMsg}</p>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                className="btn-ghost btn flex-1 justify-center"
                disabled={status === 'uploading'}
                onClick={close}
              >
                Cancel
              </button>
              <button
                className="btn flex-1 justify-center"
                disabled={!file || status === 'uploading' || status === 'success'}
                style={(!file || status === 'uploading' || status === 'success') ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                onClick={submit}
              >
                {status === 'uploading' ? 'Uploading…' : status === 'success' ? '✓ Uploaded' : 'Upload →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

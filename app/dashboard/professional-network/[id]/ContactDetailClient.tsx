'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import type { ProfessionalContact, AcceptingStatus, RelationshipStrength } from '@/types/professional-network'

const ACCEPTING_OPTIONS: AcceptingStatus[] = ['unknown', 'accepting', 'limited', 'not_accepting']
const ACCEPTING_LABEL: Record<AcceptingStatus, string> = {
  unknown: 'Unknown',
  accepting: 'Accepting',
  limited: 'Limited',
  not_accepting: 'Not Accepting',
}
const ACCEPTING_PILL: Record<AcceptingStatus, string> = {
  unknown: 'pill-gray',
  accepting: 'pill-green',
  limited: 'pill-amber',
  not_accepting: 'pill-red',
}

const STRENGTH_OPTIONS: RelationshipStrength[] = ['unknown', 'cold', 'warm', 'strong']
const STRENGTH_LABEL: Record<RelationshipStrength, string> = {
  unknown: 'Unknown',
  cold: 'Cold',
  warm: 'Warm',
  strong: 'Strong',
}
const STRENGTH_PILL: Record<RelationshipStrength, string> = {
  unknown: 'pill-gray',
  cold: 'pill-gray',
  warm: 'pill-amber',
  strong: 'pill-green',
}

export default function ContactDetailClient({ contact: initial }: { contact: ProfessionalContact }) {
  const router = useRouter()
  const [contact, setContact] = useState(initial)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [archiving, setArchiving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/professional-network/contacts/${contact.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(await res.text())
      const updated = await res.json()
      setContact(updated)
      setEditing(false)
    } catch (err) {
      alert('Failed to save. Please try again.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function handleArchive() {
    if (!confirm(`Archive ${contact.full_name}? They won't appear in the network or suggested matches.`)) return
    setArchiving(true)
    try {
      const res = await fetch(`/api/professional-network/contacts/${contact.id}/archive`, { method: 'POST' })
      if (!res.ok) throw new Error(await res.text())
      router.push('/dashboard/professional-network')
    } catch (err) {
      alert('Failed to archive. Please try again.')
      console.error(err)
    } finally {
      setArchiving(false)
    }
  }

  function setField(key: keyof ProfessionalContact, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const tags = contact.professional_contact_tags ?? []
  const notes = (contact.professional_contact_notes ?? []).filter((n) => !n.deleted_at)
  const subs = contact.sub_contacts ?? []

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title={contact.full_name} />
        <main className="flex-1 p-6">
          <div className="grid grid-cols-12 gap-5">

            {/* Back link + actions */}
            <div className="col-span-12 flex items-center justify-between">
              <Link
                href="/dashboard/professional-network"
                className="text-sm flex items-center gap-1 hover:underline"
                style={{ color: 'var(--ink-soft)' }}
              >
                ← Network
              </Link>
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <button className="btn-primary text-sm px-4 py-1.5" onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                    <button className="btn-secondary text-sm px-4 py-1.5" onClick={() => { setForm(contact); setEditing(false) }}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-secondary text-sm px-4 py-1.5" onClick={() => setEditing(true)}>
                      Edit
                    </button>
                    <button
                      className="text-sm px-4 py-1.5 rounded-md border hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
                      style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
                      onClick={handleArchive}
                      disabled={archiving}
                    >
                      {archiving ? 'Archiving…' : 'Archive'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Profile card */}
            <div className="col-span-12 lg:col-span-8 card card-pad flex flex-col gap-5">
              {contact.do_not_refer && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  <span className="font-semibold">Do Not Refer</span>
                  {contact.do_not_refer_reason && <span>— {contact.do_not_refer_reason}</span>}
                </div>
              )}

              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <EditableField
                  label="Full Name" value={editing ? form.full_name : contact.full_name}
                  editing={editing} required
                  onChange={(v) => setField('full_name', v)}
                />
                <EditableField
                  label="Firm / Practice" value={editing ? form.firm_name : contact.firm_name}
                  editing={editing}
                  onChange={(v) => setField('firm_name', v)}
                />
                <EditableField
                  label="Title / Role" value={editing ? form.title : contact.title}
                  editing={editing}
                  onChange={(v) => setField('title', v)}
                />
                <EditableField
                  label="Email" value={editing ? form.email : contact.email}
                  editing={editing} type="email"
                  onChange={(v) => setField('email', v)}
                />
                <EditableField
                  label="Phone" value={editing ? form.phone : contact.phone}
                  editing={editing} type="tel"
                  onChange={(v) => setField('phone', v)}
                />
                <EditableField
                  label="City" value={editing ? form.city : contact.city}
                  editing={editing}
                  onChange={(v) => setField('city', v)}
                />
                <EditableField
                  label="Region / County" value={editing ? form.region : contact.region}
                  editing={editing}
                  onChange={(v) => setField('region', v)}
                />
                <EditableField
                  label="State" value={editing ? form.state_province : contact.state_province}
                  editing={editing}
                  onChange={(v) => setField('state_province', v)}
                />
              </div>

              <hr style={{ borderColor: 'var(--line)' }} />

              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {/* Accepting status */}
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color: 'var(--ink-soft)' }}>Accepting Status</div>
                  {editing ? (
                    <select
                      className="input w-full"
                      value={form.accepting_status}
                      onChange={(e) => setField('accepting_status', e.target.value as AcceptingStatus)}
                    >
                      {ACCEPTING_OPTIONS.map((o) => (
                        <option key={o} value={o}>{ACCEPTING_LABEL[o]}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`pill ${ACCEPTING_PILL[contact.accepting_status]}`}>
                        {ACCEPTING_LABEL[contact.accepting_status]}
                      </span>
                      {contact.accepting_status_verified_at && (
                        <span className="text-xs" style={{ color: 'var(--ink-soft)' }}>
                          verified {new Date(contact.accepting_status_verified_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Relationship strength */}
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color: 'var(--ink-soft)' }}>Relationship</div>
                  {editing ? (
                    <select
                      className="input w-full"
                      value={form.relationship_strength}
                      onChange={(e) => setField('relationship_strength', e.target.value as RelationshipStrength)}
                    >
                      {STRENGTH_OPTIONS.map((o) => (
                        <option key={o} value={o}>{STRENGTH_LABEL[o]}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`pill ${STRENGTH_PILL[contact.relationship_strength]}`}>
                      {STRENGTH_LABEL[contact.relationship_strength]}
                    </span>
                  )}
                </div>

                {/* Do not refer */}
                {editing && (
                  <div className="col-span-2 flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="do_not_refer"
                      checked={form.do_not_refer}
                      onChange={(e) => setField('do_not_refer', e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="do_not_refer" className="text-sm cursor-pointer">Do Not Refer</label>
                    {form.do_not_refer && (
                      <input
                        className="input flex-1"
                        placeholder="Reason (optional)"
                        value={form.do_not_refer_reason ?? ''}
                        onChange={(e) => setField('do_not_refer_reason', e.target.value)}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar metadata */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
              <div className="card card-pad text-xs flex flex-col gap-2" style={{ color: 'var(--ink-soft)' }}>
                <div className="font-semibold uppercase tracking-wider mb-1">Record Info</div>
                <div>Added {new Date(contact.created_at).toLocaleDateString()}</div>
                <div>Updated {new Date(contact.updated_at).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Tags — Stage 3 */}
            <div className="col-span-12 lg:col-span-8 card">
              <div className="card-head">
                <span>Tags</span>
                <span className="text-xs font-normal" style={{ color: 'var(--ink-soft)' }}>Coming in Stage 3</span>
              </div>
              {tags.length > 0 ? (
                <div className="px-5 py-4 flex flex-wrap gap-2">
                  {tags.map((ct) => (
                    <span key={ct.tag.id} className="pill pill-gray">{ct.tag.label}</span>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-4 text-sm" style={{ color: 'var(--ink-soft)' }}>No tags yet.</div>
              )}
            </div>

            {/* Notes — Stage 3 */}
            <div className="col-span-12 lg:col-span-8 card">
              <div className="card-head">
                <span>Notes</span>
                <span className="text-xs font-normal" style={{ color: 'var(--ink-soft)' }}>Coming in Stage 3</span>
              </div>
              {notes.length > 0 ? (
                <div className="px-5 py-4 flex flex-col gap-3">
                  {notes.map((n) => (
                    <div key={n.id} className="text-sm border-l-2 pl-3" style={{ borderColor: 'var(--brand)', color: 'var(--ink)' }}>
                      <p>{n.note_text}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>
                        {new Date(n.created_at).toLocaleDateString()}
                        {!n.include_in_search && ' · Private'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-4 text-sm" style={{ color: 'var(--ink-soft)' }}>No notes yet.</div>
              )}
            </div>

            {/* Sub-contacts — Stage 3 */}
            <div className="col-span-12 lg:col-span-8 card">
              <div className="card-head">
                <span>Assistants / Sub-contacts</span>
                <span className="text-xs font-normal" style={{ color: 'var(--ink-soft)' }}>Coming in Stage 3</span>
              </div>
              {subs.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider" style={{ color: 'var(--ink-soft)' }}>
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-5 py-3 font-medium">Role</th>
                      <th className="px-5 py-3 font-medium">Phone</th>
                      <th className="px-5 py-3 font-medium">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subs.map((s) => (
                      <tr key={s.id} className="border-t" style={{ borderColor: 'var(--line)' }}>
                        <td className="px-5 py-3 font-medium">{s.full_name}</td>
                        <td className="px-5 py-3" style={{ color: 'var(--ink-soft)' }}>{s.role ?? '—'}</td>
                        <td className="px-5 py-3" style={{ color: 'var(--ink-soft)' }}>{s.phone ?? '—'}</td>
                        <td className="px-5 py-3" style={{ color: 'var(--ink-soft)' }}>{s.email ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-5 py-4 text-sm" style={{ color: 'var(--ink-soft)' }}>No sub-contacts yet.</div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

function EditableField({
  label, value, editing, required, type = 'text', onChange,
}: {
  label: string
  value: string | null | undefined
  editing: boolean
  required?: boolean
  type?: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <div className="text-xs font-medium mb-1" style={{ color: 'var(--ink-soft)' }}>{label}</div>
      {editing ? (
        <input
          type={type}
          required={required}
          className="input w-full"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div className="text-sm">{value || <span style={{ color: 'var(--ink-soft)' }}>—</span>}</div>
      )}
    </div>
  )
}

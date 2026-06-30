'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import type {
  ProfessionalContact, ProfessionalTag,
  AcceptingStatus, RelationshipStrength, TagCategory,
} from '@/types/professional-network'

const ACCEPTING_OPTIONS: AcceptingStatus[] = ['unknown', 'accepting', 'limited', 'not_accepting']
const ACCEPTING_LABEL: Record<AcceptingStatus, string> = {
  unknown: 'Unknown', accepting: 'Accepting', limited: 'Limited', not_accepting: 'Not Accepting',
}
const ACCEPTING_PILL: Record<AcceptingStatus, string> = {
  unknown: 'pill-gray', accepting: 'pill-green', limited: 'pill-amber', not_accepting: 'pill-red',
}

const STRENGTH_OPTIONS: RelationshipStrength[] = ['unknown', 'cold', 'warm', 'strong']
const STRENGTH_LABEL: Record<RelationshipStrength, string> = {
  unknown: 'Unknown', cold: 'Cold', warm: 'Warm', strong: 'Strong',
}
const STRENGTH_PILL: Record<RelationshipStrength, string> = {
  unknown: 'pill-gray', cold: 'pill-gray', warm: 'pill-amber', strong: 'pill-green',
}

const CATEGORY_LABEL: Record<TagCategory, string> = {
  profession: 'Profession',
  specialty: 'Specialty',
  client_situation: 'Client Situation',
  language: 'Language',
  working_style: 'Working Style',
}

const CATEGORY_ORDER: TagCategory[] = ['profession', 'specialty', 'client_situation', 'language', 'working_style']

export default function ContactDetailClient({
  contact: initial,
  allTags,
}: {
  contact: ProfessionalContact
  allTags: ProfessionalTag[]
}) {
  const router = useRouter()
  const [contact, setContact] = useState(initial)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [archiving, setArchiving] = useState(false)

  // Tags state
  const [contactTagIds, setContactTagIds] = useState<Set<string>>(
    new Set((initial.professional_contact_tags ?? []).map((ct) => ct.tag.id))
  )
  const [tagSaving, setTagSaving] = useState<string | null>(null)

  // Notes state
  const [notes, setNotes] = useState((initial.professional_contact_notes ?? []).filter((n) => !n.deleted_at))
  const [noteText, setNoteText] = useState('')
  const [notePrivate, setNotePrivate] = useState(false)
  const [notesSaving, setNotesSaving] = useState(false)

  // Sub-contacts state
  const [subs, setSubs] = useState(initial.sub_contacts ?? [])
  const [showSubForm, setShowSubForm] = useState(false)
  const [subSaving, setSubSaving] = useState(false)

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
      setForm(updated)
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
    } finally {
      setArchiving(false)
    }
  }

  async function toggleTag(tag: ProfessionalTag) {
    setTagSaving(tag.id)
    const has = contactTagIds.has(tag.id)
    try {
      const res = await fetch(`/api/professional-network/contacts/${contact.id}/tags`, {
        method: has ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag_id: tag.id }),
      })
      if (!res.ok) throw new Error(await res.text())
      setContactTagIds((prev) => {
        const next = new Set(prev)
        has ? next.delete(tag.id) : next.add(tag.id)
        return next
      })
    } catch (err) {
      alert('Failed to update tag.')
      console.error(err)
    } finally {
      setTagSaving(null)
    }
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault()
    if (!noteText.trim()) return
    setNotesSaving(true)
    try {
      const res = await fetch(`/api/professional-network/contacts/${contact.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note_text: noteText.trim(), include_in_search: !notePrivate }),
      })
      if (!res.ok) throw new Error(await res.text())
      const created = await res.json()
      setNotes((prev) => [created, ...prev])
      setNoteText('')
      setNotePrivate(false)
    } catch (err) {
      alert('Failed to save note.')
      console.error(err)
    } finally {
      setNotesSaving(false)
    }
  }

  async function handleAddSub(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubSaving(true)
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch(`/api/professional-network/contacts/${contact.id}/sub-contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fd.get('full_name'),
          role: fd.get('role'),
          phone: fd.get('phone'),
          email: fd.get('email'),
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      const created = await res.json()
      setSubs((prev) => [...prev, created])
      setShowSubForm(false)
    } catch (err) {
      alert('Failed to save.')
      console.error(err)
    } finally {
      setSubSaving(false)
    }
  }

  async function handleDeleteSub(subId: string) {
    if (!confirm('Remove this sub-contact?')) return
    try {
      const res = await fetch(`/api/professional-network/contacts/${contact.id}/sub-contacts`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sub_contact_id: subId }),
      })
      if (!res.ok) throw new Error(await res.text())
      setSubs((prev) => prev.filter((s) => s.id !== subId))
    } catch (err) {
      alert('Failed to remove.')
      console.error(err)
    }
  }

  function setField(key: keyof ProfessionalContact, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // Group all tags by category for the picker
  const tagsByCategory = CATEGORY_ORDER.reduce((acc, cat) => {
    acc[cat] = allTags.filter((t) => t.category === cat)
    return acc
  }, {} as Record<TagCategory, ProfessionalTag[]>)

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title={contact.full_name} />
        <main className="flex-1 p-6">
          <div className="grid grid-cols-12 gap-5">

            {/* Back + actions */}
            <div className="col-span-12 flex items-center justify-between">
              <Link href="/dashboard/professional-network" className="text-sm flex items-center gap-1 hover:underline" style={{ color: 'var(--ink-soft)' }}>
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
                    <button className="btn-secondary text-sm px-4 py-1.5" onClick={() => setEditing(true)}>Edit</button>
                    <button
                      className="text-sm px-4 py-1.5 rounded-md border hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
                      style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
                      onClick={handleArchive} disabled={archiving}
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
                <EditableField label="Full Name" value={editing ? form.full_name : contact.full_name} editing={editing} required onChange={(v) => setField('full_name', v)} />
                <EditableField label="Firm / Practice" value={editing ? form.firm_name : contact.firm_name} editing={editing} onChange={(v) => setField('firm_name', v)} />
                <EditableField label="Title / Role" value={editing ? form.title : contact.title} editing={editing} onChange={(v) => setField('title', v)} />
                <EditableField label="Email" value={editing ? form.email : contact.email} editing={editing} type="email" onChange={(v) => setField('email', v)} />
                <EditableField label="Phone" value={editing ? form.phone : contact.phone} editing={editing} type="tel" onChange={(v) => setField('phone', v)} />
                <EditableField label="City" value={editing ? form.city : contact.city} editing={editing} onChange={(v) => setField('city', v)} />
                <EditableField label="Region / County" value={editing ? form.region : contact.region} editing={editing} onChange={(v) => setField('region', v)} />
                <EditableField label="State" value={editing ? form.state_province : contact.state_province} editing={editing} onChange={(v) => setField('state_province', v)} />
              </div>

              <hr style={{ borderColor: 'var(--line)' }} />

              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color: 'var(--ink-soft)' }}>Accepting Status</div>
                  {editing ? (
                    <select className="input w-full" value={form.accepting_status} onChange={(e) => setField('accepting_status', e.target.value as AcceptingStatus)}>
                      {ACCEPTING_OPTIONS.map((o) => <option key={o} value={o}>{ACCEPTING_LABEL[o]}</option>)}
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`pill ${ACCEPTING_PILL[contact.accepting_status]}`}>{ACCEPTING_LABEL[contact.accepting_status]}</span>
                      {contact.accepting_status_verified_at && (
                        <span className="text-xs" style={{ color: 'var(--ink-soft)' }}>verified {new Date(contact.accepting_status_verified_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs font-medium mb-1" style={{ color: 'var(--ink-soft)' }}>Relationship</div>
                  {editing ? (
                    <select className="input w-full" value={form.relationship_strength} onChange={(e) => setField('relationship_strength', e.target.value as RelationshipStrength)}>
                      {STRENGTH_OPTIONS.map((o) => <option key={o} value={o}>{STRENGTH_LABEL[o]}</option>)}
                    </select>
                  ) : (
                    <span className={`pill ${STRENGTH_PILL[contact.relationship_strength]}`}>{STRENGTH_LABEL[contact.relationship_strength]}</span>
                  )}
                </div>

                {editing && (
                  <div className="col-span-2 flex items-center gap-3">
                    <input type="checkbox" id="do_not_refer" checked={form.do_not_refer} onChange={(e) => setField('do_not_refer', e.target.checked)} className="w-4 h-4 cursor-pointer" />
                    <label htmlFor="do_not_refer" className="text-sm cursor-pointer">Do Not Refer</label>
                    {form.do_not_refer && (
                      <input className="input flex-1" placeholder="Reason (optional)" value={form.do_not_refer_reason ?? ''} onChange={(e) => setField('do_not_refer_reason', e.target.value)} />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Record info */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
              <div className="card card-pad text-xs flex flex-col gap-2" style={{ color: 'var(--ink-soft)' }}>
                <div className="font-semibold uppercase tracking-wider mb-1">Record Info</div>
                <div>Added {new Date(contact.created_at).toLocaleDateString()}</div>
                <div>Updated {new Date(contact.updated_at).toLocaleDateString()}</div>
              </div>
            </div>

            {/* ── TAGS ── */}
            <div className="col-span-12 lg:col-span-8 card">
              <div className="card-head"><span>Tags</span></div>
              <div className="px-5 py-4 flex flex-col gap-4">
                {CATEGORY_ORDER.map((cat) => {
                  const tags = tagsByCategory[cat]
                  if (!tags.length) return null
                  return (
                    <div key={cat}>
                      <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--ink-soft)' }}>
                        {CATEGORY_LABEL[cat]}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => {
                          const active = contactTagIds.has(tag.id)
                          const loading = tagSaving === tag.id
                          return (
                            <button
                              key={tag.id}
                              onClick={() => toggleTag(tag)}
                              disabled={loading}
                              className={`pill cursor-pointer transition-all border ${
                                active
                                  ? 'pill-green border-transparent'
                                  : 'pill-gray border-transparent hover:border-[var(--brand)] hover:text-[var(--brand)]'
                              } ${loading ? 'opacity-50' : ''}`}
                            >
                              {active && <span className="mr-1">✓</span>}
                              {tag.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── NOTES ── */}
            <div className="col-span-12 lg:col-span-8 card">
              <div className="card-head"><span>Notes</span></div>
              <div className="px-5 py-4 flex flex-col gap-4">
                {/* Add note form */}
                <form onSubmit={handleAddNote} className="flex flex-col gap-2">
                  <textarea
                    className="input w-full resize-none"
                    rows={3}
                    placeholder="Add a note about this professional (not client-specific)…"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs cursor-pointer select-none" style={{ color: 'var(--ink-soft)' }}>
                      <input
                        type="checkbox"
                        checked={notePrivate}
                        onChange={(e) => setNotePrivate(e.target.checked)}
                        className="w-3.5 h-3.5"
                      />
                      Private (exclude from search index)
                    </label>
                    <button
                      type="submit"
                      className="btn-primary text-sm px-4 py-1.5"
                      disabled={notesSaving || !noteText.trim()}
                    >
                      {notesSaving ? 'Saving…' : 'Add Note'}
                    </button>
                  </div>
                </form>

                {/* Notes timeline */}
                {notes.length > 0 && (
                  <div className="flex flex-col gap-3 pt-2 border-t" style={{ borderColor: 'var(--line)' }}>
                    {notes.map((n) => (
                      <div key={n.id} className="flex gap-3">
                        <div className="w-0.5 shrink-0 rounded-full mt-1" style={{ background: n.include_in_search ? 'var(--brand)' : 'var(--line)', alignSelf: 'stretch' }} />
                        <div className="flex-1">
                          <p className="text-sm" style={{ color: 'var(--ink)' }}>{n.note_text}</p>
                          <p className="text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>
                            {new Date(n.created_at).toLocaleDateString()}
                            {!n.include_in_search && (
                              <span className="ml-2 pill pill-gray text-[10px]">Private</span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {notes.length === 0 && (
                  <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>No notes yet.</p>
                )}
              </div>
            </div>

            {/* ── SUB-CONTACTS ── */}
            <div className="col-span-12 lg:col-span-8 card">
              <div className="card-head">
                <span>Assistants / Sub-contacts</span>
                <button className="text-xs font-medium" style={{ color: 'var(--brand)' }} onClick={() => setShowSubForm(true)}>
                  + Add
                </button>
              </div>

              {subs.length > 0 && (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider" style={{ color: 'var(--ink-soft)' }}>
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-5 py-3 font-medium">Role</th>
                      <th className="px-5 py-3 font-medium">Phone</th>
                      <th className="px-5 py-3 font-medium">Email</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {subs.map((s) => (
                      <tr key={s.id} className="border-t" style={{ borderColor: 'var(--line)' }}>
                        <td className="px-5 py-3 font-medium">{s.full_name}</td>
                        <td className="px-5 py-3" style={{ color: 'var(--ink-soft)' }}>{s.role ?? '—'}</td>
                        <td className="px-5 py-3" style={{ color: 'var(--ink-soft)' }}>{s.phone ?? '—'}</td>
                        <td className="px-5 py-3" style={{ color: 'var(--ink-soft)' }}>{s.email ?? '—'}</td>
                        <td className="px-5 py-3 text-right">
                          <button className="text-xs hover:text-red-600" style={{ color: 'var(--ink-soft)' }} onClick={() => handleDeleteSub(s.id)}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {subs.length === 0 && !showSubForm && (
                <div className="px-5 py-4 text-sm" style={{ color: 'var(--ink-soft)' }}>No sub-contacts yet.</div>
              )}

              {showSubForm && (
                <form onSubmit={handleAddSub} className="px-5 py-4 flex flex-col gap-3 border-t" style={{ borderColor: 'var(--line)' }}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--ink-soft)' }}>Full Name *</label>
                      <input name="full_name" required className="input w-full" />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--ink-soft)' }}>Role</label>
                      <input name="role" placeholder="Assistant, Paralegal…" className="input w-full" />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--ink-soft)' }}>Phone</label>
                      <input name="phone" type="tel" className="input w-full" />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--ink-soft)' }}>Email</label>
                      <input name="email" type="email" className="input w-full" />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="submit" className="btn-primary text-sm px-4 py-1.5" disabled={subSaving}>
                      {subSaving ? 'Saving…' : 'Save'}
                    </button>
                    <button type="button" className="btn-secondary text-sm px-4 py-1.5" onClick={() => setShowSubForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

function EditableField({ label, value, editing, required, type = 'text', onChange }: {
  label: string; value: string | null | undefined; editing: boolean; required?: boolean; type?: string; onChange: (v: string) => void
}) {
  return (
    <div>
      <div className="text-xs font-medium mb-1" style={{ color: 'var(--ink-soft)' }}>{label}</div>
      {editing ? (
        <input type={type} required={required} className="input w-full" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <div className="text-sm">{value || <span style={{ color: 'var(--ink-soft)' }}>—</span>}</div>
      )}
    </div>
  )
}

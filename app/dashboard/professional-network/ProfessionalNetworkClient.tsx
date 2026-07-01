'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import type { ProfessionalContact, AcceptingStatus, RelationshipStrength, TagCategory, ProfessionalTag } from '@/types/professional-network'

const CATEGORY_PILL: Record<TagCategory, string> = {
  profession:       'pill-blue',
  specialty:        'pill-purple',
  client_situation: 'pill-amber',
  language:         'pill-teal',
  working_style:    'pill-green',
}

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

export default function ProfessionalNetworkClient({
  initialContacts,
  professionTags,
}: {
  initialContacts: ProfessionalContact[]
  professionTags: ProfessionalTag[]
}) {
  const router = useRouter()
  const [contacts, setContacts] = useState(initialContacts)
  const [q, setQ] = useState('')
  const [filterAccepting, setFilterAccepting] = useState('All')
  const [filterStrength, setFilterStrength] = useState('All')
  const [filterProfession, setFilterProfession] = useState('All')
  const [showAddForm, setShowAddForm] = useState(false)
  const [saving, setSaving] = useState(false)

  // Server-side search state
  const [searchResults, setSearchResults] = useState<ProfessionalContact[] | null>(null)
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!q.trim()) { setSearchResults(null); return }

    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/professional-network/search?q=${encodeURIComponent(q.trim())}`)
        if (res.ok) setSearchResults(await res.json())
      } finally {
        setSearching(false)
      }
    }, 300)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [q])

  // Base list: ranked search results when searching, full list otherwise
  const baseList = searchResults ?? contacts

  const rows = useMemo(() => {
    return baseList.filter((c) => {
      if (filterAccepting !== 'All' && c.accepting_status !== filterAccepting) return false
      if (filterStrength !== 'All' && c.relationship_strength !== filterStrength) return false
      if (filterProfession !== 'All') {
        const tags = c.professional_contact_tags ?? []
        const hasProfession = tags.some((ct) => ct.tag.slug === filterProfession)
        if (!hasProfession) return false
      }
      return true
    })
  }, [baseList, filterAccepting, filterStrength, filterProfession])

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const form = new FormData(e.currentTarget)
    const payload = {
      full_name: form.get('full_name'),
      firm_name: form.get('firm_name'),
      title: form.get('title'),
      email: form.get('email'),
      phone: form.get('phone'),
      city: form.get('city'),
      region: form.get('region'),
      state_province: form.get('state_province') || 'FL',
      accepting_status: 'unknown',
      relationship_strength: 'unknown',
    }
    try {
      const res = await fetch('/api/professional-network/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      const created = await res.json()
      setContacts((prev) => [created, ...prev].sort((a, b) => a.full_name.localeCompare(b.full_name)))
      setShowAddForm(false)
    } catch (err) {
      alert('Failed to save contact. Please try again.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="Professional Network" />
        <main className="flex-1 p-6">
          <div className="grid grid-cols-12 gap-5">

            {/* Filters bar */}
            <div className="col-span-12 card card-pad flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <input
                  className="input w-full"
                  placeholder="Search by name, firm, specialty, location…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                {searching && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--ink-soft)' }}>
                    Searching…
                  </span>
                )}
              </div>
              <p className="w-full text-xs -mt-1" style={{ color: 'var(--ink-soft)' }}>
                Tip: search for what the professional does, not the client situation — e.g. "medicaid miami" or "cpa broward accepting"
              </p>
              <FilterGroup
                label="Profession"
                value={filterProfession}
                setValue={setFilterProfession}
                options={['All', ...professionTags.map((t) => t.slug)]}
                labelMap={Object.fromEntries(professionTags.map((t) => [t.slug, t.label]))}
              />
              <FilterGroup
                label="Accepting"
                value={filterAccepting}
                setValue={setFilterAccepting}
                options={['All', 'accepting', 'limited', 'unknown', 'not_accepting']}
                labelMap={ACCEPTING_LABEL}
              />
              <FilterGroup
                label="Relationship"
                value={filterStrength}
                setValue={setFilterStrength}
                options={['All', 'strong', 'warm', 'cold', 'unknown']}
                labelMap={STRENGTH_LABEL}
              />
              <div className="text-xs ml-auto" style={{ color: 'var(--ink-soft)' }}>
                {searchResults
                  ? <><span className="font-semibold text-[var(--ink)]">{rows.length}</span> result{rows.length !== 1 ? 's' : ''} for "{q}"</>
                  : <>Showing <span className="font-semibold text-[var(--ink)]">{rows.length}</span> of {contacts.length}</>
                }
              </div>
              <button
                className="btn-primary text-sm px-4 py-1.5"
                onClick={() => setShowAddForm(true)}
              >
                + Add Contact
              </button>
            </div>

            {/* Contacts table */}
            <div className="col-span-12 card">
              <div className="card-head">
                <span>Network</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider" style={{ color: 'var(--ink-soft)' }}>
                    <th className="px-5 py-3 font-medium">Name / Firm</th>
                    <th className="px-5 py-3 font-medium">Location</th>
                    <th className="px-5 py-3 font-medium">Accepting</th>
                    <th className="px-5 py-3 font-medium">Relationship</th>
                    <th className="px-5 py-3 font-medium">Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr
                      key={c.id}
                      className="row-hover border-t cursor-pointer"
                      style={{ borderColor: 'var(--line)' }}
                      onClick={() => router.push(`/dashboard/professional-network/${c.id}`)}
                    >
                      <td className="px-5 py-3">
                        <span className="font-medium">{c.full_name}</span>
                        {c.do_not_refer && (
                          <span className="ml-2 pill pill-red text-[10px]">Do Not Refer</span>
                        )}
                        {c.firm_name && (
                          <div className="text-xs mt-0.5" style={{ color: 'var(--ink-soft)' }}>
                            {c.firm_name}{c.title ? ` · ${c.title}` : ''}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3 text-sm" style={{ color: 'var(--ink-soft)' }}>
                        {[c.city, c.region].filter(Boolean).join(', ') || '—'}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`pill ${ACCEPTING_PILL[c.accepting_status]}`}>
                          {ACCEPTING_LABEL[c.accepting_status]}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`pill ${STRENGTH_PILL[c.relationship_strength]}`}>
                          {STRENGTH_LABEL[c.relationship_strength]}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <TagList contact={c} />
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-sm" style={{ color: 'var(--ink-soft)' }}>
                        {contacts.length === 0
                          ? 'No contacts yet. Add your first contact to get started.'
                          : searchResults
                          ? `No contacts found for "${q}".`
                          : 'No contacts match these filters.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Quick-add slide-over */}
      {showAddForm && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowAddForm(false)} />
          <div className="relative z-50 w-full max-w-md bg-white shadow-xl flex flex-col h-full overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--line)' }}>
              <h2 className="font-semibold text-base">Add Contact</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-xl leading-none"
                style={{ color: 'var(--ink-soft)' }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAdd} className="flex flex-col gap-4 px-6 py-5 flex-1">
              <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
                New contacts default to <strong>accepting: unknown</strong> until you verify their status.
              </p>

              <Field label="Full Name *" name="full_name" required />
              <Field label="Firm / Practice Name" name="firm_name" />
              <Field label="Title / Role" name="title" />

              <hr style={{ borderColor: 'var(--line)' }} />

              <Field label="Email" name="email" type="email" />
              <Field label="Phone" name="phone" type="tel" />

              <hr style={{ borderColor: 'var(--line)' }} />

              <Field label="City" name="city" />
              <Field label="Region / County / Metro" name="region" />
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ink-soft)' }}>State</label>
                <select name="state_province" className="input w-full" defaultValue="FL">
                  <option value="FL">FL</option>
                  <option value="GA">GA</option>
                  <option value="NY">NY</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mt-auto pt-4 flex gap-3">
                <button type="submit" className="btn-primary flex-1 py-2" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Contact'}
                </button>
                <button type="button" className="btn-secondary flex-1 py-2" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function TagList({ contact }: { contact: ProfessionalContact }) {
  const tags = contact.professional_contact_tags ?? []
  if (tags.length === 0) return <span style={{ color: 'var(--ink-soft)' }}>—</span>
  return (
    <div className="flex flex-wrap gap-1">
      {tags.slice(0, 3).map((ct) => (
        <span
          key={ct.tag.id}
          className={`pill text-[10px] ${CATEGORY_PILL[ct.tag.category as TagCategory] ?? 'pill-gray'}`}
        >
          {ct.tag.label}
        </span>
      ))}
      {tags.length > 3 && (
        <span className="pill pill-gray text-[10px]">+{tags.length - 3}</span>
      )}
    </div>
  )
}

function Field({ label, name, required, type = 'text' }: { label: string; name: string; required?: boolean; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ink-soft)' }}>{label}</label>
      <input name={name} type={type} required={required} className="input w-full" />
    </div>
  )
}

function FilterGroup({
  label, value, setValue, options, labelMap,
}: {
  label: string
  value: string
  setValue: (v: string) => void
  options: string[]
  labelMap?: Record<string, string>
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold" style={{ color: 'var(--ink-soft)' }}>{label}:</span>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="text-sm px-2.5 py-1.5 rounded-md border bg-white pr-8 cursor-pointer hover:border-[var(--brand)] transition-colors"
        style={{
          borderColor: value === 'All' ? 'var(--line)' : 'var(--brand)',
          background: value === 'All' ? 'white' : 'var(--brand-soft)',
          color: value === 'All' ? 'var(--ink)' : 'var(--brand-dark)',
          fontWeight: value === 'All' ? 400 : 500,
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o === 'All' ? 'All' : (labelMap?.[o] ?? o)}</option>
        ))}
      </select>
    </div>
  )
}

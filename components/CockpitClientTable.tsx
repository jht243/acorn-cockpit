'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { deriveClientStatus } from '@/lib/client-status'

type SortKey = 'name' | 'plan' | 'status' | 'last_contact' | 'open_actions'
type SortDir = 'asc' | 'desc'

const PLAN_ORDER: Record<string, number> = { Mahogany: 0, Sycamore: 1, 'Royal Oak': 2, Intake: 3 }
const STATUS_ORDER: Record<string, number> = { 'Follow-Up': 0, Review: 1, Active: 2, Onboarding: 3 }

export default function CockpitClientTable({ clients }: { clients: any[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const toggle = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = useMemo(() => {
    return [...clients].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'name') cmp = (a.name ?? '').localeCompare(b.name ?? '')
      else if (sortKey === 'plan') cmp = (PLAN_ORDER[a.plan] ?? 9) - (PLAN_ORDER[b.plan] ?? 9)
      else if (sortKey === 'status') {
        const sa = deriveClientStatus(a).label
        const sb = deriveClientStatus(b).label
        cmp = (STATUS_ORDER[sa] ?? 9) - (STATUS_ORDER[sb] ?? 9)
      }
      else if (sortKey === 'last_contact') {
        const da = a.last_contact ? +new Date(a.last_contact) : 0
        const db = b.last_contact ? +new Date(b.last_contact) : 0
        cmp = da - db
      }
      else if (sortKey === 'open_actions') {
        const oa = (a.action_items || []).filter((x: any) => x.status !== 'done').length
        const ob = (b.action_items || []).filter((x: any) => x.status !== 'done').length
        cmp = oa - ob
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [clients, sortKey, sortDir])

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left" style={{ color: 'var(--ink-soft)' }}>
          <SortTh label="Client"       col="name"          active={sortKey} dir={sortDir} onSort={toggle} />
          <SortTh label="Plan"         col="plan"          active={sortKey} dir={sortDir} onSort={toggle} />
          <SortTh label="Status"       col="status"        active={sortKey} dir={sortDir} onSort={toggle} />
          <SortTh label="Last Contact" col="last_contact"  active={sortKey} dir={sortDir} onSort={toggle} />
        </tr>
      </thead>
      <tbody>
        {sorted.map((c) => {
          const s = deriveClientStatus(c)
          return (
            <tr key={c.id} className="row-hover border-t" style={{ borderColor: 'var(--line)' }}>
              <td className="px-5 py-3">
                <Link href={`/dashboard/clients/${c.id}`} className="font-medium hover:underline">{c.name}</Link>
                <div className="text-xs" style={{ color: 'var(--ink-soft)' }}>{c.family}</div>
              </td>
              <td className="px-5 py-3"><PlanPill plan={c.plan} /></td>
              <td className="px-5 py-3"><span className={`pill ${s.pillClass}`} title={s.tooltip}>{s.label}</span></td>
              <td className="px-5 py-3 text-xs" style={{ color: 'var(--ink-soft)' }}>
                {c.last_contact ? new Date(c.last_contact).toLocaleDateString() : '—'}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function SortTh({ label, col, active, dir, onSort }: {
  label: string; col: SortKey; active: SortKey; dir: SortDir; onSort: (k: SortKey) => void
}) {
  const isActive = active === col
  return (
    <th
      className="px-5 py-3 font-medium text-xs uppercase tracking-wider cursor-pointer select-none hover:text-[var(--ink)] transition-colors"
      onClick={() => onSort(col)}
    >
      <span className="flex items-center gap-1">
        {label}
        <span className="opacity-40" style={{ opacity: isActive ? 1 : 0.3, color: isActive ? 'var(--brand)' : undefined }}>
          {isActive ? (dir === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </span>
    </th>
  )
}

function PlanPill({ plan }: { plan: string }) {
  const cls = plan === 'Mahogany' ? 'pill-amber' : plan === 'Sycamore' ? 'pill-green' : 'pill-gray'
  return <span className={`pill ${cls}`}>{plan}</span>
}

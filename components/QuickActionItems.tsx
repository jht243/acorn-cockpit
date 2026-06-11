'use client'

import { useState } from 'react'
import Link from 'next/link'

type Task = { id: string; title: string; due_date?: string | null; status: string; owner: string }
type ClientSummary = { id: string; name: string; tasks: Task[] }

export default function QuickActionItems({ clients }: { clients: ClientSummary[] }) {
  const [selectedId, setSelectedId] = useState(clients[0]?.id ?? '')

  const selected = clients.find((c) => c.id === selectedId)
  const open = (selected?.tasks ?? []).filter((t) => t.status !== 'done')

  return (
    <div className="col-span-12 lg:col-span-4 card flex flex-col" style={{ background: 'var(--brand-soft)', borderColor: 'var(--brand-soft)' }}>
      <div className="card-head">
        <span>Action items</span>
        {selected && (
          <Link href={`/dashboard/clients/${selected.id}`} className="text-xs font-normal normal-case" style={{ color: 'var(--brand)' }}>
            Open profile →
          </Link>
        )}
      </div>

      {/* Client selector */}
      <div className="px-5 pt-4 pb-2">
        <select
          className="select w-full"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {clients.map((c) => {
            const openCount = c.tasks.filter((t) => t.status !== 'done').length
            return (
              <option key={c.id} value={c.id}>
                {c.name}{openCount > 0 ? ` (${openCount})` : ''}
              </option>
            )
          })}
        </select>
      </div>

      {/* Task list */}
      <ul className="flex-1">
        {open.length === 0 && (
          <li className="px-5 py-4 text-sm" style={{ color: 'var(--ink-soft)' }}>
            No open tasks for {selected?.name.split(' ')[0] ?? 'this client'}.
          </li>
        )}
        {open.map((t) => (
          <li key={t.id} className="px-5 py-3 border-t flex items-start gap-3" style={{ borderColor: 'var(--line)' }}>
            <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: t.status === 'in_progress' ? '#c08a3e' : 'var(--ink-soft)' }} />
            <div className="flex-1 min-w-0">
              <div className="text-sm">{t.title}</div>
              <div className="text-xs mt-0.5 flex items-center gap-2 flex-wrap" style={{ color: 'var(--ink-soft)' }}>
                <span>{t.owner === 'Karli' ? 'You' : selected?.name.split(' ')[0]}</span>
                {t.due_date && <span>· due {t.due_date}</span>}
                {t.status === 'in_progress' && <span className="pill pill-amber" style={{ fontSize: 10, padding: '1px 5px' }}>In progress</span>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

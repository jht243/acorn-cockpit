'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createTask, setTaskStatus, sendTaskReminder } from '@/lib/task-actions'
import { taskReminderHtml, taskReminderSubject } from '@/lib/email-templates'

type Task = {
  id: string
  title: string
  due_date?: string | null
  status: 'open' | 'in_progress' | 'done'
  owner: 'Karli' | 'Client'
  source_meeting?: string | null
}

export default function ClientTasks({
  clientId,
  clientName,
  clientEmail,
  items,
}: {
  clientId: string
  clientName: string
  clientEmail?: string | null
  items: Task[]
}) {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>(items || [])
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [owner, setOwner] = useState<'Client' | 'Karli'>('Client')
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Reminder modal state
  const [reminderTask, setReminderTask] = useState<Task | null>(null)
  const [reminderStatus, setReminderStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [reminderError, setReminderError] = useState<string | null>(null)

  const onAdd = () => {
    setError(null)
    if (!title.trim()) return
    startTransition(async () => {
      const res = await createTask(clientId, title, { dueDate: dueDate || null, owner })
      if (res.success && res.task) {
        setTasks((t) => [...t, res.task as Task])
        setTitle('')
        setDueDate('')
        setOwner('Client')
        setAdding(false)
        router.refresh()
      } else {
        setError(res.error || 'Failed to create task')
      }
    })
  }

  const onToggle = (task: Task, done: boolean) => {
    setTasks((list) => list.map((t) => (t.id === task.id ? { ...t, status: done ? 'done' : 'open' } : t)))
    startTransition(async () => {
      await setTaskStatus(clientId, task.id, done)
      router.refresh()
    })
  }

  const openReminder = (task: Task) => {
    setReminderError(null)
    setReminderStatus('idle')
    setReminderTask(task)
  }

  const sendReminder = () => {
    if (!reminderTask) return
    setReminderStatus('sending')
    setReminderError(null)
    startTransition(async () => {
      const res = await sendTaskReminder(clientId, reminderTask.id)
      if (res.success) {
        setReminderStatus('sent')
        setTimeout(() => setReminderTask(null), 1400)
      } else {
        setReminderStatus('error')
        setReminderError(res.error || 'Failed to send')
      }
    })
  }

  return (
    <div className="col-span-12 lg:col-span-7 card">
      <div className="card-head">
        <div className="flex flex-col gap-0.5">
          <span>Action items &amp; to-dos</span>
          <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: 'var(--ink-soft)' }}>
            Create a task for this client and send them an email reminder
          </span>
        </div>
        <button className="btn" onClick={() => setAdding((v) => !v)}>{adding ? 'Cancel' : '+ New task'}</button>
      </div>

      {adding && (
        <div className="px-5 py-4 border-t" style={{ borderColor: 'var(--line)', background: '#f9fbfa' }}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-6">
              <label className="label">Task</label>
              <input className="input" placeholder="e.g., Send in 2026 tax returns" autoFocus
                value={title} onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') onAdd() }} />
            </div>
            <div className="md:col-span-3">
              <label className="label">Due date (optional)</label>
              <input type="date" className="input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className="md:col-span-3">
              <label className="label">For</label>
              <select className="select" value={owner} onChange={(e) => setOwner(e.target.value as 'Client' | 'Karli')}>
                <option value="Client">Client</option>
                <option value="Karli">Karli</option>
              </select>
            </div>
          </div>
          {error && <div className="text-xs mt-2" style={{ color: 'var(--danger)' }}>{error}</div>}
          <div className="mt-3 flex gap-2">
            <button className="btn" disabled={pending || !title.trim()} onClick={onAdd}>{pending ? 'Adding…' : 'Add task'}</button>
          </div>
        </div>
      )}

      <ul>
        {tasks.length === 0 && (
          <li className="px-5 py-4 text-sm border-t" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
            No tasks yet. Create one to get started.
          </li>
        )}
        {tasks.map((a) => (
          <li key={a.id} className="px-5 py-3 border-t flex items-center justify-between gap-3" style={{ borderColor: 'var(--line)' }}>
            <label className="flex items-start gap-3 flex-1 min-w-0 cursor-pointer">
              <input type="checkbox" checked={a.status === 'done'} className="mt-1"
                onChange={(e) => onToggle(a, e.target.checked)} />
              <div className="min-w-0">
                <div className={`text-sm ${a.status === 'done' ? 'line-through opacity-60' : ''}`}>{a.title}</div>
                <div className="text-xs flex flex-wrap items-center gap-x-2" style={{ color: 'var(--ink-soft)' }}>
                  <span>{a.owner === 'Karli' ? 'Owner: Karli' : 'Owner: Client'}</span>
                  {a.due_date && <span>· due {a.due_date}</span>}
                  {a.source_meeting && <span className="inline-flex items-center gap-1">· <span className="pill pill-gray" style={{ fontSize: 10, padding: '1px 6px' }}>Fathom</span> {a.source_meeting}</span>}
                </div>
              </div>
            </label>
            <div className="flex items-center gap-2 shrink-0">
              {a.status !== 'done' && a.owner === 'Client' && (
                <button className="btn-ghost btn text-xs normal-case" onClick={() => openReminder(a)}>Send reminder</button>
              )}
              <span className={`pill ${a.status === 'done' ? 'pill-green' : a.status === 'in_progress' ? 'pill-amber' : 'pill-gray'}`}>
                {a.status === 'done' ? 'Done' : a.status === 'in_progress' ? 'In progress' : 'Open'}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Reminder email preview modal */}
      {reminderTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(31,42,36,0.45)' }}
          onClick={() => reminderStatus !== 'sending' && setReminderTask(null)}>
          <div className="card w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden" style={{ background: 'white' }} onClick={(e) => e.stopPropagation()}>
            <div className="card-head shrink-0"><span>Send reminder email</span></div>
            <div className="card-pad flex-1 overflow-auto">
              <div className="text-xs mb-3" style={{ color: 'var(--ink-soft)' }}>
                <div><span className="font-semibold" style={{ color: 'var(--ink)' }}>To:</span> {clientEmail || '— no email on file —'}</div>
                <div><span className="font-semibold" style={{ color: 'var(--ink)' }}>Subject:</span> {taskReminderSubject(reminderTask.title)}</div>
              </div>
              <div className="rounded-md border p-3" style={{ borderColor: 'var(--line)', background: '#fcfdfc' }}
                dangerouslySetInnerHTML={{ __html: taskReminderHtml(clientName, reminderTask.title) }} />
              {reminderStatus === 'error' && <div className="text-xs mt-3" style={{ color: 'var(--danger)' }}>{reminderError}</div>}
            </div>
            <div className="card-pad border-t flex items-center justify-end gap-2 shrink-0" style={{ borderColor: 'var(--line)' }}>
              {reminderStatus === 'sent' ? (
                <span className="pill pill-green">✓ Reminder sent</span>
              ) : (
                <>
                  <button className="btn-ghost btn" disabled={reminderStatus === 'sending'} onClick={() => setReminderTask(null)}>Cancel</button>
                  <button className="btn" disabled={reminderStatus === 'sending' || !clientEmail} onClick={sendReminder}>
                    {reminderStatus === 'sending' ? 'Sending…' : 'Send email'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

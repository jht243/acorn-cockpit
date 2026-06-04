export type IntakeStage = 'done' | 'in_progress' | 'invited' | 'none'

export interface IntakeFields {
  intake_invited_at?: string | null
  intake_started_at?: string | null
  intake_submitted_at?: string | null
}

export function intakeProgress(client: IntakeFields): { label: string; pct: number; kind: IntakeStage } {
  if (client.intake_submitted_at) return { label: 'Submitted', pct: 100, kind: 'done' }
  if (client.intake_started_at) return { label: 'In progress', pct: 50, kind: 'in_progress' }
  if (client.intake_invited_at) return { label: 'Invited', pct: 10, kind: 'invited' }
  return { label: 'Not started', pct: 0, kind: 'none' }
}

export function intakeProgressPillClass(kind: IntakeStage): string {
  if (kind === 'done') return 'pill-green'
  if (kind === 'in_progress') return 'pill-amber'
  return 'pill-gray'
}

export type IntakeStage = 'done' | 'in_progress' | 'invited' | 'none'

export interface IntakeFields {
  intake_invited_at?: string | null
  intake_started_at?: string | null
  intake_submitted_at?: string | null
  intake_completion_pct?: number | null
}

/**
 * 10 weighted checkpoints matching the revised intake flow.
 * Each filled checkpoint contributes 10% to the completion score.
 * Submitted intakes always read 100%.
 */
export const INTAKE_CHECKPOINTS: { key: string; label: string; check: (d: any) => boolean }[] = [
  {
    key: 'about',
    label: 'About you',
    check: (d) => !!(d?.clientName && d?.email),
  },
  {
    key: 'contact',
    label: 'Contact info',
    check: (d) => !!(d?.phone || d?.address),
  },
  {
    key: 'goals',
    label: 'Goals',
    check: (d) =>
      (Array.isArray(d?.goalsSelected) && d.goalsSelected.length > 0) || !!d?.goals,
  },
  {
    key: 'family',
    label: 'Family',
    check: (d) =>
      !!(
        d?.children ||
        d?.spouseName ||
        (Array.isArray(d?.dependentsSelected) && d.dependentsSelected.length > 0)
      ),
  },
  {
    key: 'team',
    label: 'Professional team',
    check: (d) => {
      const team = d?.professionalTeam
      if (!team) return false
      return Object.values(team).some((v: any) => v?.name || v?.dontHave)
    },
  },
  {
    key: 'assets',
    label: 'Assets',
    check: (d) =>
      (Array.isArray(d?.assetTypes) && d.assetTypes.length > 0) ||
      (Array.isArray(d?.assets) && d.assets.some((a: any) => a?.label && a?.value)),
  },
  {
    key: 'liabilities',
    label: 'Liabilities',
    check: (d) =>
      (Array.isArray(d?.liabilityTypes) && d.liabilityTypes.length > 0) ||
      (Array.isArray(d?.liabilities) && d.liabilities.some((l: any) => l?.label && l?.balance)) ||
      d?.noLiabilities === true,
  },
  {
    key: 'income',
    label: 'Income',
    check: (d) => !!d?.annualIncome,
  },
  {
    key: 'risk',
    label: 'Risk & clarity',
    check: (d) => !!(d?.risk || d?.financialClarity),
  },
  {
    key: 'estate',
    label: 'Estate & insurance',
    check: (d) =>
      !!(
        d?.hasWill ||
        d?.hasTrust ||
        d?.hasLifeIns ||
        d?.hasPOA ||
        d?.hasHealthcareDirective ||
        d?.hasBeneficiaryDesignations
      ),
  },
]

export function computeIntakeCompletionPct(formData: any): number {
  if (!formData) return 0
  const total = INTAKE_CHECKPOINTS.length
  const done = INTAKE_CHECKPOINTS.reduce((acc, cp) => acc + (cp.check(formData) ? 1 : 0), 0)
  return Math.round((done / total) * 100)
}

export function intakeProgress(client: IntakeFields): { label: string; pct: number; kind: IntakeStage } {
  if (client.intake_submitted_at) return { label: 'Submitted', pct: 100, kind: 'done' }
  const pct = client.intake_completion_pct ?? 0
  if (client.intake_started_at || pct > 0) {
    return { label: pct > 0 ? `${pct}% complete` : 'In progress', pct: Math.max(pct, 5), kind: 'in_progress' }
  }
  if (client.intake_invited_at) return { label: 'Invited', pct: 0, kind: 'invited' }
  return { label: 'Not started', pct: 0, kind: 'none' }
}

export function intakeProgressPillClass(kind: IntakeStage): string {
  if (kind === 'done') return 'pill-green'
  if (kind === 'in_progress') return 'pill-amber'
  return 'pill-gray'
}

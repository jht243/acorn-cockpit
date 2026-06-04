import { intakeProgress } from './intake-progress'

export type DerivedStatus = {
  label: string
  pct?: number
  kind: 'onboarding' | 'review' | 'follow_up' | 'active'
  pillClass: string
  tooltip: string
}

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Derives a client's working status from real signals (intake completion,
 * last contact, next meeting, open action items) instead of trusting the raw
 * `status` column. Returns the label, color class, and a tooltip explaining
 * exactly why this client is in this bucket.
 */
export function deriveClientStatus(client: any): DerivedStatus {
  const ip = intakeProgress(client)

  // 1. Onboarding — intake not submitted yet
  if (!client.intake_submitted_at) {
    return {
      label: `Onboarding · ${ip.pct}%`,
      pct: ip.pct,
      kind: 'onboarding',
      pillClass: 'pill-gray',
      tooltip: `Intake form is ${ip.pct}% complete (${ip.label}). They become "Review" once they submit.`,
    }
  }

  const now = Date.now()
  const lastContact = client.last_contact ? new Date(client.last_contact).getTime() : null
  const nextMeeting = client.next_meeting ? new Date(client.next_meeting).getTime() : null
  const submittedAt = new Date(client.intake_submitted_at).getTime()
  const daysSinceContact = lastContact ? Math.floor((now - lastContact) / DAY_MS) : null
  const daysSinceSubmit = Math.floor((now - submittedAt) / DAY_MS)
  const openActions = (client.action_items || []).filter((a: any) => a.status !== 'done')
  const overdueActions = openActions.filter((a: any) => a.due_date && new Date(a.due_date).getTime() < now)

  // 2. Review — intake just submitted, advisor needs to build the plan
  if (daysSinceSubmit <= 14 && !nextMeeting) {
    return {
      label: 'Review',
      kind: 'review',
      pillClass: 'pill-amber',
      tooltip: `Intake submitted ${daysSinceSubmit} day${daysSinceSubmit === 1 ? '' : 's'} ago — needs proposal / first meeting scheduled.`,
    }
  }

  // 3. Follow-Up — explicit overdue: stale contact, overdue actions, or missed meeting cadence
  if (overdueActions.length > 0 || (daysSinceContact !== null && daysSinceContact > 90) || (!nextMeeting && daysSinceContact !== null && daysSinceContact > 60)) {
    const reasons: string[] = []
    if (overdueActions.length > 0) reasons.push(`${overdueActions.length} overdue action${overdueActions.length === 1 ? '' : 's'}`)
    if (daysSinceContact !== null && daysSinceContact > 90) reasons.push(`no contact in ${daysSinceContact} days`)
    if (!nextMeeting && daysSinceContact !== null && daysSinceContact > 60) reasons.push('no upcoming meeting scheduled')
    return {
      label: 'Follow-Up',
      kind: 'follow_up',
      pillClass: 'pill-red',
      tooltip: `Needs your attention: ${reasons.join(' · ')}.`,
    }
  }

  // 4. Active — engaged plan, healthy cadence
  return {
    label: 'Active',
    kind: 'active',
    pillClass: 'pill-green',
    tooltip: `Healthy: ${daysSinceContact !== null ? `last contact ${daysSinceContact}d ago` : 'recent contact'}${nextMeeting ? ' · meeting upcoming' : ''}${openActions.length ? ` · ${openActions.length} open action${openActions.length === 1 ? '' : 's'}` : ''}.`,
  }
}

export const STATUS_LEGEND: { kind: DerivedStatus['kind']; label: string; meaning: string; pillClass: string }[] = [
  { kind: 'onboarding', label: 'Onboarding · NN%', pillClass: 'pill-gray', meaning: 'Intake form not yet submitted. Percentage shows how much of the 10-section form they have filled out.' },
  { kind: 'review', label: 'Review', pillClass: 'pill-amber', meaning: 'Intake just submitted within the last 14 days. Karli still needs to build the proposal or schedule the first plan meeting.' },
  { kind: 'follow_up', label: 'Follow-Up', pillClass: 'pill-red', meaning: 'Needs attention: an action item is overdue, no contact in 90+ days, or no upcoming meeting after 60+ days of silence.' },
  { kind: 'active', label: 'Active', pillClass: 'pill-green', meaning: 'Plan is in motion — recent contact, scheduled meeting, no overdue items.' },
]

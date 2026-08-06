import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import Link from "next/link";
import { getClients, intakeProgress } from "../../utils/supabase/queries";
import InviteClientButton from "../../components/InviteClientButton";
import SendReminderButton from "../../components/SendReminderButton";
import QuickActionItems from "../../components/QuickActionItems";
import CockpitClientTable from "../../components/CockpitClientTable";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const allClients = await getClients();
  const clients = q
    ? allClients.filter((c: any) => c.name?.toLowerCase().includes(q.toLowerCase()) || c.email?.toLowerCase().includes(q.toLowerCase()))
    : allClients;
  const followups = clients.filter((c: any) => c.status === "Follow-Up").length;
  const intakes = clients.filter((c: any) => c.plan === "Intake").length;
  const openActions = clients.flatMap((c: any) => (c.action_items || []).filter((a: any) => a.status !== "done"));
  const submittedIntakes = clients.filter((c: any) => c.intake_submitted_at).length;
  const needsIntakeHelp = clients.filter((c: any) =>
    !c.intake_submitted_at && (c.intake_started_at || c.intake_invited_at)
  );

  const upcoming = clients
    .filter((c: any) => c.next_meeting)
    .map((c: any) => ({ name: c.name, id: c.id, date: c.next_meeting!, plan: c.plan }))
    .sort((a: any, b: any) => +new Date(a.date) - +new Date(b.date));

  const pendingIntakes = clients.filter((c: any) => !c.intake_submitted_at && (c.intake_invited_at || c.status === "Onboarding"));

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Cockpit" />
        <main className="flex-1 p-4 sm:p-6">
          {q && (
            <div className="mb-4 flex items-center gap-3 px-4 py-2.5 rounded-md border text-sm" style={{ borderColor: "var(--line)", background: "var(--brand-soft)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
              <span>Showing <strong>{clients.length}</strong> result{clients.length !== 1 ? "s" : ""} for <strong>"{q}"</strong></span>
              <Link href="/dashboard" className="ml-auto text-xs" style={{ color: "var(--brand)" }}>Clear search</Link>
            </div>
          )}
          <div className="grid grid-cols-12 gap-5">
            <Kpi label="Planning Snapshot" value={String(submittedIntakes)} hint={`from intake · ${submittedIntakes} of ${clients.length} complete`} tone="up" />
            <Kpi label="Active clients" value={String(clients.length)} hint={`${intakes} in onboarding`} />
            <Kpi label="Follow-ups due" value={String(followups)} hint="this week" tone={followups ? "down" : undefined} />
            <Kpi label="Open action items" value={String(openActions.length)} hint={`${openActions.filter(a => a.owner === "Karli").length} owned by you`} />

            <div className="col-span-12 lg:col-span-8 card" style={{ alignSelf: 'start' }}>
              <div className="card-head">
                <span>Clients</span>
                <InviteClientButton />
              </div>
              <CockpitClientTable clients={clients} />
            </div>

            <QuickActionItems
              clients={clients.map((c: any) => ({
                id: c.id,
                name: c.name,
                tasks: (c.action_items || []).map((a: any) => ({
                  id: a.id,
                  title: a.title,
                  due_date: a.due_date ?? null,
                  status: a.status,
                  owner: a.owner,
                })),
              }))}
            />

            {pendingIntakes.length > 0 && (
              <div className="col-span-12 card">
                <div className="card-head">
                  <div className="flex flex-col gap-0.5">
                    <span>Pending intakes</span>
                    <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>Clients invited but not yet submitted · {pendingIntakes.length} pending</span>
                  </div>
                  <InviteClientButton label="+ Invite client" />
                </div>
                <ul>
                  {pendingIntakes.map((c: any) => {
                    const submitted = c.intake_submitted_at;
                    const started = c.intake_started_at;
                    const invited = c.intake_invited_at;
                    let label = "Not started", pct = 0, color = "#c4cac6";
                    if (submitted) { label = "Submitted"; pct = 100; color = "#2f7d4f"; }
                    else if (started) { label = "In progress"; pct = 50; color = "#c08a3e"; }
                    else if (invited) { label = "Invited"; pct = 10; color = "#7f8d85"; }
                    return (
                      <li key={c.id} className="px-5 py-3 border-t flex items-center gap-4" style={{ borderColor: "var(--line)" }}>
                        <div className="flex-1 min-w-0">
                          <Link href={`/dashboard/clients/${c.id}`} className="font-medium text-sm hover:underline">{c.name}</Link>
                          <div className="text-xs truncate" style={{ color: "var(--ink-soft)" }}>{c.email}{invited && <> · invited {new Date(invited).toLocaleDateString()}</>}{c.intake_reminders_sent > 0 && <> · {c.intake_reminders_sent} reminder{c.intake_reminders_sent > 1 ? 's' : ''} sent</>}</div>
                        </div>
                        <div className="w-40 flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[11px]" style={{ color: "var(--ink-soft)" }}>
                            <span className="font-medium">{label}</span>
                            <span className="tabular-nums">{pct}%</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
                            <div style={{ width: `${pct}%`, background: color, height: "100%" }} />
                          </div>
                        </div>
                        <SendReminderButton clientId={c.id} lastReminderAt={c.intake_last_reminder_at} remindersSent={c.intake_reminders_sent} />
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {needsIntakeHelp.length > 0 && (
              <div className="col-span-12 lg:col-span-4 card">
                <div className="card-head">
                  <div className="flex flex-col gap-0.5">
                    <span>Needs Intake Help</span>
                    <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>Started but not submitted · consider booking a help call</span>
                  </div>
                  <span className="pill pill-amber">{needsIntakeHelp.length}</span>
                </div>
                <ul>
                  {needsIntakeHelp.map((c: any) => (
                    <li key={c.id} className="px-5 py-3 border-t flex items-center justify-between gap-3" style={{ borderColor: "var(--line)" }}>
                      <div className="flex-1 min-w-0">
                        <Link href={`/dashboard/clients/${c.id}`} className="font-medium text-sm hover:underline">{c.name}</Link>
                        <div className="text-xs mt-0.5 flex items-center gap-1.5 flex-wrap" style={{ color: "var(--ink-soft)" }}>
                          <span>{c.intake_started_at ? "Started" : "Invited"} · not submitted</span>
                          {c.help_requested && (
                            <span className="pill pill-amber text-[10px]">Help requested</span>
                          )}
                        </div>
                      </div>
                      <SendReminderButton clientId={c.id} lastReminderAt={c.intake_last_reminder_at} remindersSent={c.intake_reminders_sent} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="col-span-12 lg:col-span-4 card">
              <div className="card-head">
                <div className="flex flex-col gap-0.5">
                  <span>Upcoming meetings</span>
                  <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>via Calendly + Google Calendar</span>
                </div>
              </div>
              <ul>
                {upcoming.map((u) => (
                  <li key={u.id} className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: "var(--line)" }}>
                    <div>
                      <Link href={`/dashboard/clients/${u.id}`} className="font-medium text-sm hover:underline">{u.name}</Link>
                      <div className="text-xs" style={{ color: "var(--ink-soft)" }}>{u.plan} plan</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{new Date(u.date).toLocaleDateString()}</div>
                      <div className="text-xs" style={{ color: "var(--ink-soft)" }}>2-hour review</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

function Kpi({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: "up" | "down" }) {
  return (
    <div className="col-span-12 sm:col-span-6 lg:col-span-3 card card-pad">
      <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--ink-soft)" }}>{label}</div>
      <div className={`kpi-num mt-1 ${tone ?? ""}`}>{value}</div>
      {hint && <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>{hint}</div>}
    </div>
  );
}


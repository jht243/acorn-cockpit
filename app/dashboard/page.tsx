import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import Link from "next/link";
import { fmtUSD } from "../../lib/data";
import { getClients } from "../../utils/supabase/queries";

function netWorth(c: any) {
  const a = c.assets?.reduce((s: number, x: any) => s + Number(x.value), 0) || 0;
  const l = c.liabilities?.reduce((s: number, x: any) => s + Number(x.balance), 0) || 0;
  return { assets: a, liabilities: l, net: a - l };
}

export const revalidate = 0;

export default async function Dashboard() {
  const clients = await getClients();
  const totalAUM = clients.reduce((s: number, c: any) => s + netWorth(c).net, 0);
  const followups = clients.filter((c: any) => c.status === "Follow-Up").length;
  const intakes = clients.filter((c: any) => c.plan === "Intake").length;
  const openActions = clients.flatMap((c: any) => (c.action_items || []).filter((a: any) => a.status !== "done"));

  const upcoming = clients
    .filter((c: any) => c.next_meeting)
    .map((c: any) => ({ name: c.name, id: c.id, date: c.next_meeting!, plan: c.plan }))
    .sort((a: any, b: any) => +new Date(a.date) - +new Date(b.date));

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="Cockpit" />
        <main className="flex-1 p-6">
          <div className="grid grid-cols-12 gap-5">
            <Kpi label="Net worth managed" value={fmtUSD(totalAUM)} hint="across 5 clients · via Plaid" tone="up" />
            <Kpi label="Active clients" value={String(clients.length)} hint={`${intakes} in onboarding`} />
            <Kpi label="Follow-ups due" value={String(followups)} hint="this week" tone={followups ? "down" : undefined} />
            <Kpi label="Open action items" value={String(openActions.length)} hint={`${openActions.filter(a => a.owner === "Karli").length} owned by you`} />

            <div className="col-span-12 lg:col-span-8 card">
              <div className="card-head">
                <span>Clients</span>
                <Link href="/intake" className="btn">+ Send intake link</Link>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left" style={{ color: "var(--ink-soft)" }}>
                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Client</th>
                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Plan</th>
                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Net Worth</th>
                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Last Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => {
                    const nw = netWorth(c);
                    return (
                      <tr key={c.id} className="row-hover border-t" style={{ borderColor: "var(--line)" }}>
                        <td className="px-5 py-3">
                          <Link href={`/dashboard/clients/${c.id}`} className="font-medium hover:underline">{c.name}</Link>
                          <div className="text-xs" style={{ color: "var(--ink-soft)" }}>{c.family}</div>
                        </td>
                        <td className="px-5 py-3"><PlanPill plan={c.plan} /></td>
                        <td className="px-5 py-3"><StatusPill status={c.status} /></td>
                        <td className="px-5 py-3 font-medium tabular-nums">{fmtUSD(nw.net)}<div className="text-[10px] font-normal" style={{ color: "var(--ink-soft)" }}>via Plaid</div></td>
                        <td className="px-5 py-3" style={{ color: "var(--ink-soft)" }}>
                          <div>{c.last_contact ? new Date(c.last_contact).toLocaleDateString() : '—'}</div>
                          {c.last_contact_signal && (
                            <div className="text-[10px] mt-0.5 flex items-center gap-1">
                              <SourceBadge source={c.last_contact_signal.source} /> <span className="truncate">{c.last_contact_signal.label}</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

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

            <div className="col-span-12 lg:col-span-7 card">
              <div className="card-head">
                <div className="flex flex-col gap-0.5">
                  <span>Action items — from last meeting notes</span>
                  <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>Auto-extracted from your Fathom transcripts · across all clients</span>
                </div>
              </div>
              <ul>
                {clients.flatMap((c: any) => (c.action_items || []).filter((a: any) => a.status !== "done" && a.owner === "Karli").map((a: any) => ({ ...a, client: c }))).map((a: any) => (
                  <li key={a.id} className="px-5 py-3 border-t flex items-center justify-between gap-4" style={{ borderColor: "var(--line)" }}>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{a.title}</div>
                      <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
                        <Link href={`/dashboard/clients/${a.client.id}`} className="hover:underline">{a.client.name}</Link>
                        {a.due_date && <> · due {a.due_date}</>}
                      </div>
                    </div>
                    <span className={`pill ${a.status === "in_progress" ? "pill-amber" : "pill-gray"}`}>
                      {a.status === "in_progress" ? "In progress" : "Open"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-12 lg:col-span-5 card">
              <div className="card-head">
                <div className="flex flex-col gap-0.5">
                  <span>This week</span>
                  <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>Auto-fired by cadence engine · 30-day, 6-month, renewals, RMDs</span>
                </div>
              </div>
              <div className="card-pad">
                <div className="flex items-start gap-3 mb-3">
                  <span className="pill pill-green">In 2 days</span>
                  <div className="text-sm">Send Roth conversion analysis to <Link href="/dashboard/clients/11111111-1111-1111-1111-111111111111" className="font-medium hover:underline">Anita</Link>.</div>
                </div>
                <div className="flex items-start gap-3 mb-3">
                  <span className="pill pill-amber">In 4 days</span>
                  <div className="text-sm">Refer <Link href="/dashboard/clients/11111111-1111-1111-1111-111111111111" className="font-medium hover:underline">Anita</Link> to estate attorney.</div>
                </div>
                <div className="flex items-start gap-3 mb-3">
                  <span className="pill pill-amber">Next week</span>
                  <div className="text-sm">Schedule Q1 check-in with <Link href="/dashboard/clients/33333333-3333-3333-3333-333333333333" className="font-medium hover:underline">Dr. Ryan & Chere</Link>.</div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="pill pill-gray">Cadence</span>
                  <div className="text-sm" style={{ color: "var(--ink-soft)" }}>3 clients due for 6-month review in Mar.</div>
                </div>
              </div>
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

function PlanPill({ plan }: { plan: string }) {
  const cls =
    plan === "Mahogany" ? "pill-amber"
    : plan === "Sycamore" ? "pill-green"
    : plan === "Royal Oak" ? "pill-gray"
    : "pill-gray";
  return <span className={`pill ${cls}`}>{plan}</span>;
}

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "Follow-Up" ? "pill-red"
    : status === "Review" ? "pill-amber"
    : status === "Onboarding" ? "pill-gray"
    : "pill-green";
  return <span className={`pill ${cls}`}>{status}</span>;
}

function SourceBadge({ source }: { source: string }) {
  const palette: Record<string, { bg: string; fg: string }> = {
    "Google Cal": { bg: "#e8f0fe", fg: "#1a73e8" },
    "Gmail": { bg: "#fce8e6", fg: "#c5221f" },
    "Calendly": { bg: "#e7f0ff", fg: "#0069ff" },
    "Plaid": { bg: "#eef4f8", fg: "#155e8a" },
    "Fathom": { bg: "#f1ecfe", fg: "#5b3dbe" },
  };
  const p = palette[source] ?? { bg: "#eef0ee", fg: "#4a544f" };
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide" style={{ background: p.bg, color: p.fg }}>{source}</span>
  );
}

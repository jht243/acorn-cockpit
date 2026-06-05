"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Sidebar from "../../../components/Sidebar";
import TopBar from "../../../components/TopBar";
import { fmtUSD } from "../../../lib/data";
import InviteClientButton from "../../../components/InviteClientButton";
import SendReminderButton from "../../../components/SendReminderButton";
import { intakeProgress, intakeProgressPillClass } from "../../../lib/intake-progress";
import { deriveClientStatus, STATUS_LEGEND } from "../../../lib/client-status";

function netWorth(c: any) {
  const a = c.assets?.reduce((s: number, x: any) => s + Number(x.value), 0) || 0;
  const l = c.liabilities?.reduce((s: number, x: any) => s + Number(x.balance), 0) || 0;
  return { assets: a, liabilities: l, net: a - l };
}

export default function ClientsClient({ initialClients }: { initialClients: any[] }) {
  const [q, setQ] = useState("");
  const [plan, setPlan] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");

  const rows = useMemo(() => {
    return initialClients.filter((c) => {
      if (plan !== "All" && c.plan !== plan) return false;
      if (status !== "All" && c.status !== status) return false;
      if (q && !c.name.toLowerCase().includes(q.toLowerCase()) && !(c.family ?? "").toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, plan, status]);

  const totalNW = rows.reduce((s, c) => s + netWorth(c).net, 0);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="Clients" />
        <main className="flex-1 p-6">
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 card card-pad flex flex-wrap items-center gap-3">
              <input
                className="input flex-1 min-w-[220px]"
                placeholder="Search by name or family…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <FilterGroup label="Plan" value={plan} setValue={setPlan} options={["All", "Royal Oak", "Sycamore", "Mahogany", "Intake"]} />
              <FilterGroup label="Status" value={status} setValue={setStatus} options={["All", "Active", "Onboarding", "Review", "Follow-Up"]} />
              <StatusLegend />
              <div className="text-xs ml-auto" style={{ color: "var(--ink-soft)" }}>
                Showing <span className="font-semibold text-[var(--ink)]">{rows.length}</span> of {initialClients.length} · {fmtUSD(totalNW)} net worth
              </div>
            </div>

            <div className="col-span-12 card">
              <div className="card-head">
                <span>Roster</span>
                <InviteClientButton />
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left" style={{ color: "var(--ink-soft)" }}>
                    <Th>Client</Th>
                    <Th>Plan</Th>
                    <Th>Status</Th>
                    <Th>Net Worth</Th>
                    <Th>Intake</Th>
                    <Th>Last Contact</Th>
                    <Th>Next Meeting</Th>
                    <Th>Open Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => {
                    const nw = netWorth(c);
                    const open = (c.action_items || []).filter((a: any) => a.status !== "done").length;
                    return (
                      <tr key={c.id} className="row-hover border-t" style={{ borderColor: "var(--line)" }}>
                        <td className="px-5 py-3">
                          <Link href={`/dashboard/clients/${c.id}`} className="font-medium hover:underline">{c.name}</Link>
                          <div className="text-xs truncate max-w-[260px]" style={{ color: "var(--ink-soft)" }}>{c.family}</div>
                        </td>
                        <td className="px-5 py-3"><PlanPill plan={c.plan} /></td>
                        <td className="px-5 py-3"><StatusPill status={c.status} client={c} /></td>
                        <td className="px-5 py-3 font-medium tabular-nums">{fmtUSD(nw.net)}<div className="text-[10px] font-normal" style={{ color: "var(--ink-soft)" }}>via Plaid</div></td>
                        <td className="px-5 py-3"><IntakeCell client={c} /></td>
                        <td className="px-5 py-3" style={{ color: "var(--ink-soft)" }}>
                          <div className="text-xs">{c.last_contact ? new Date(c.last_contact).toLocaleDateString() : '—'}</div>
                          {c.last_contact_signal && (
                            <div className="text-[10px] mt-0.5 flex items-center gap-1">
                              <SourceBadge source={c.last_contact_signal.source} />
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3 text-xs" style={{ color: "var(--ink-soft)" }}>
                          {c.next_meeting ? (
                            <div className="flex flex-col gap-0.5">
                              <span>{new Date(c.next_meeting).toLocaleDateString()}</span>
                              <SourceBadge source="Calendly" />
                            </div>
                          ) : "—"}
                        </td>
                        <td className="px-5 py-3 text-sm">
                          <span className={`pill ${open > 5 ? "pill-amber" : open > 0 ? "pill-gray" : "pill-green"}`}>{open}</span>
                        </td>
                      </tr>
                    );
                  })}
                  {rows.length === 0 && (
                    <tr><td colSpan={8} className="px-5 py-10 text-center text-sm" style={{ color: "var(--ink-soft)" }}>No clients match these filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">{children}</th>;
}

function StatusLegend() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md hover:bg-[var(--brand-soft)]"
        style={{ color: "var(--ink-soft)" }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        What do these statuses mean?
      </button>
      {open && (
        <div className="absolute z-30 mt-1 left-0 w-[420px] bg-white border rounded-lg shadow-lg p-4" style={{ borderColor: "var(--line)" }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--ink-soft)" }}>Status meanings</div>
          <div className="flex flex-col gap-3">
            {STATUS_LEGEND.map((item) => (
              <div key={item.kind} className="flex items-start gap-3">
                <span className={`pill ${item.pillClass} shrink-0 mt-0.5`}>{item.label}</span>
                <span className="text-xs leading-relaxed" style={{ color: "var(--ink-soft)" }}>{item.meaning}</span>
              </div>
            ))}
          </div>
          <div className="text-[10px] mt-3 pt-3 border-t" style={{ color: "var(--ink-soft)", borderColor: "var(--line)" }}>
            Statuses are computed automatically from intake completion, last contact, upcoming meetings, and overdue action items.
          </div>
        </div>
      )}
    </div>
  );
}

function IntakeCell({ client }: { client: any }) {
  const ip = intakeProgress(client);

  if (ip.kind === "done") {
    return (
      <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--brand)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <div className="flex flex-col leading-tight">
          <span className="font-semibold">Submitted</span>
          {client.intake_submitted_at && (
            <span className="text-[10px] font-normal" style={{ color: "var(--ink-soft)" }}>{new Date(client.intake_submitted_at).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    );
  }

  const color = ip.kind === "in_progress" ? "#c08a3e" : ip.kind === "invited" ? "#7f8d85" : "#c4cac6";
  return (
    <div className="flex flex-col gap-1.5 min-w-[110px]">
      <div className="flex items-center justify-between text-[11px]" style={{ color: "var(--ink-soft)" }}>
        <span className="font-medium">{ip.label}</span>
        {ip.pct > 0 && <span className="tabular-nums">{ip.pct}%</span>}
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
        <div style={{ width: `${ip.pct}%`, background: color, height: "100%" }} />
      </div>
      <SendReminderButton clientId={client.id} lastReminderAt={client.intake_last_reminder_at} remindersSent={client.intake_reminders_sent} />
    </div>
  );
}

function FilterGroup({ label, value, setValue, options }: { label: string; value: string; setValue: (v: string) => void; options: string[] }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>{label}:</span>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="text-sm px-2.5 py-1.5 rounded-md border bg-white pr-8 cursor-pointer hover:border-[var(--brand)] transition-colors"
        style={{ borderColor: value === "All" ? "var(--line)" : "var(--brand)", background: value === "All" ? "white" : "var(--brand-soft)", color: value === "All" ? "var(--ink)" : "var(--brand-dark)", fontWeight: value === "All" ? 400 : 500 }}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function PlanPill({ plan }: { plan: string }) {
  const cls =
    plan === "Mahogany" ? "pill-amber"
    : plan === "Sycamore" ? "pill-green"
    : "pill-gray";
  return <span className={`pill ${cls}`}>{plan}</span>;
}

function StatusPill({ status, client }: { status: string; client?: any }) {
  if (client) {
    const s = deriveClientStatus(client);
    return <span className={`pill ${s.pillClass}`} title={s.tooltip}>{s.label}</span>;
  }
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

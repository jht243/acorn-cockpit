import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "../../../../components/Sidebar";
import TopBar from "../../../../components/TopBar";
import SendReminderButton from "../../../../components/SendReminderButton";
import CopyIntakeLinkButton from "../../../../components/CopyIntakeLinkButton";
import { getClientById } from "../../../../utils/supabase/queries";
import { intakeProgress, intakeProgressPillClass } from "../../../../lib/intake-progress";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const categoryColor: Record<string, string> = {
  Cash: "#7fb88a",
  Taxable: "#2f7d4f",
  Qualified: "#1f5a39",
  Roth: "#c08a3e",
  "Real Estate": "#8a5a3b",
  Business: "#4a544f",
};

export const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function netWorth(c: any) {
  const a = c.assets?.reduce((s: number, x: any) => s + Number(x.value), 0) || 0;
  const l = c.liabilities?.reduce((s: number, x: any) => s + Number(x.balance), 0) || 0;
  return { assets: a, liabilities: l, net: a - l };
}

export function assetsByCategory(c: any) {
  const map = new Map<string, number>();
  c.assets?.forEach((a: any) => map.set(a.category, (map.get(a.category) ?? 0) + Number(a.value)));
  const total = Array.from(map.values()).reduce((s: number, x: number) => s + x, 0);
  return Array.from(map.entries()).map(([category, value]) => ({
    category,
    value,
    pct: total ? (value / total) * 100 : 0,
  }));
}

export default async function ClientDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await getClientById(id);
  if (!client) return notFound();

  const nw = netWorth(client);
  const breakdown = assetsByCategory(client);
  const monthlyExp = client.expenses?.reduce((s: number, x: any) => s + Number(x.monthly), 0) || 0;
  const annualInc = client.income?.reduce((s: number, x: any) => s + Number(x.annual), 0) || 0;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title={client.name} breadcrumb={[{ label: "Clients", href: "/dashboard/clients" }, { label: client.name }]} />
        <main className="flex-1 p-6">
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 card card-pad">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-[var(--brand-soft)] text-[var(--brand-dark)] flex items-center justify-center font-semibold">
                      {client.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <div className="text-lg font-semibold">{client.name}</div>
                      <div className="text-sm" style={{ color: "var(--ink-soft)" }}>{client.family}</div>
                    </div>
                    <span className={`pill ${client.plan === "Mahogany" ? "pill-amber" : client.plan === "Sycamore" ? "pill-green" : "pill-gray"}`}>{client.plan}</span>
                    {client.status === "Onboarding" ? (
                      (() => {
                        const ip = intakeProgress(client);
                        return <span className={`pill ${intakeProgressPillClass(ip.kind)}`}>Onboarding · {ip.pct}%</span>;
                      })()
                    ) : (
                      <span className="pill pill-green">{client.status}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  {!client.intake_submitted_at ? (
                    <>
                      <div className="px-3 py-1.5 rounded-md border" style={{ borderColor: "var(--brand-soft)", background: "var(--brand-soft)" }}>
                        <SendReminderButton clientId={client.id} lastReminderAt={client.intake_last_reminder_at} remindersSent={client.intake_reminders_sent} />
                      </div>
                      <a
                        href={`/intake?token=${client.intake_token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost btn"
                      >
                        Open intake form
                      </a>
                      <CopyIntakeLinkButton token={client.intake_token} />
                    </>
                  ) : (
                    <>
                      <Link href={`/dashboard/proposal/${client.id}`} className="btn-ghost btn">Generate proposal PDF</Link>
                      <button className="btn-ghost btn">Generate PFS PDF</button>
                      <button className="btn">Schedule review</button>
                    </>
                  )}
                </div>
              </div>
              <div className="divider" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--ink-soft)" }}>Net worth</div>
                  <div className="kpi-num up">{fmtUSD(nw.net)}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--ink-soft)" }}>Annual income</div>
                  <div className="kpi-num">{fmtUSD(annualInc)}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--ink-soft)" }}>Monthly expenses</div>
                  <div className="kpi-num">{fmtUSD(monthlyExp)}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--ink-soft)" }}>Last contact</div>
                  <div className="kpi-num" style={{ fontSize: 18 }}>{client.last_contact ? new Date(client.last_contact).toLocaleDateString() : '—'}</div>
                  {client.last_contact_signal && (
                    <div className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--ink-soft)" }}>
                      <SourceBadge source={client.last_contact_signal.source} />
                      <span>{client.last_contact_signal.label}</span>
                    </div>
                  )}
                  {client.next_meeting && <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>Next: {new Date(client.next_meeting).toLocaleDateString()} <span className="opacity-70">· via Calendly</span></div>}
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-7 card">
              <div className="card-head"><span>Personal Financial Statement</span><span className="text-xs normal-case font-normal">{fmtUSD(nw.assets)} assets · {fmtUSD(nw.liabilities)} liabilities</span></div>
              <div className="card-pad">
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 md:col-span-5">
                    <Donut data={breakdown} />
                    <ul className="mt-3 space-y-1.5">
                      {breakdown.map((b) => (
                        <li key={b.category} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: categoryColor[b.category] ?? "#ccc" }} />
                            {b.category}
                          </span>
                          <span className="tabular-nums" style={{ color: "var(--ink-soft)" }}>{b.pct.toFixed(1)}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-span-12 md:col-span-7">
                    <div className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--ink-soft)" }}>Assets</div>
                    <ul className="text-sm divide-y" style={{ borderColor: "var(--line)" }}>
                      {(client.assets || []).map((a: any, i: number) => (
                        <li key={i} className="flex justify-between py-1.5">
                          <span>{a.label}<span className="text-xs ml-2" style={{ color: "var(--ink-soft)" }}>{a.category}</span></span>
                          <span className="tabular-nums font-medium">{fmtUSD(a.value)}</span>
                        </li>
                      ))}
                    </ul>
                    {(client.liabilities || []).length > 0 && (
                      <>
                        <div className="text-[11px] uppercase tracking-wider font-semibold mt-4 mb-2" style={{ color: "var(--ink-soft)" }}>Liabilities</div>
                        <ul className="text-sm divide-y" style={{ borderColor: "var(--line)" }}>
                          {(client.liabilities || []).map((l: any, i: number) => (
                            <li key={i} className="flex justify-between py-1.5">
                              <span>{l.label}{l.rate != null && <span className="text-xs ml-2" style={{ color: "var(--ink-soft)" }}>{l.rate}%</span>}</span>
                              <span className="tabular-nums font-medium" style={{ color: "var(--danger)" }}>−{fmtUSD(l.balance)}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5 card">
              <div className="card-head"><span>Goals</span></div>
              <ul className="card-pad space-y-2">
                {(client.goals || []).map((g: any, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5" className="mt-0.5 shrink-0"><path d="M5 13l4 4L19 7"/></svg>
                    {g}
                  </li>
                ))}
              </ul>
              <div className="card-head" style={{ borderTop: "1px solid var(--line)" }}><span>Professional team</span><button className="btn-ghost btn text-xs normal-case">+ Add</button></div>
              <ul>
                {(client.team || []).map((t: any, i: number) => (
                  <li key={i} className="px-5 py-2.5 border-t flex items-center justify-between" style={{ borderColor: "var(--line)" }}>
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs" style={{ color: "var(--ink-soft)" }}>{t.role}{t.firm && ` · ${t.firm}`}</div>
                    </div>
                    {t.email && <a href={`mailto:${t.email}`} className="text-xs" style={{ color: "var(--brand)" }}>email</a>}
                  </li>
                ))}
                {(!client.team || client.team.length === 0) && <li className="px-5 py-3 text-sm" style={{ color: "var(--ink-soft)" }}>No team contacts yet.</li>}
              </ul>
            </div>

            <div className="col-span-12 lg:col-span-7 card">
              <div className="card-head">
                <div className="flex flex-col gap-0.5">
                  <span>Action items — from last meeting notes</span>
                  <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>
                    Auto-extracted from your Fathom transcript · review before sending to client
                  </span>
                </div>
                <button className="btn">+ New action</button>
              </div>
              <ul>
                {(client.action_items || []).map((a: any) => (
                  <li key={a.id} className="px-5 py-3 border-t flex items-center justify-between gap-3" style={{ borderColor: "var(--line)" }}>
                    <label className="flex items-start gap-3 flex-1 min-w-0 cursor-pointer">
                      <input type="checkbox" defaultChecked={a.status === "done"} className="mt-1" />
                      <div className="min-w-0">
                        <div className={`text-sm ${a.status === "done" ? "line-through opacity-60" : ""}`}>{a.title}</div>
                        <div className="text-xs flex flex-wrap items-center gap-x-2" style={{ color: "var(--ink-soft)" }}>
                          <span>{a.owner === "Karli" ? "Owner: Karli" : "Owner: Client"}</span>
                          {a.due_date && <span>· due {a.due_date}</span>}
                          {a.source_meeting && <span className="inline-flex items-center gap-1">· <span className="pill pill-gray" style={{ fontSize: 10, padding: "1px 6px" }}>Fathom</span> {a.source_meeting}</span>}
                        </div>
                      </div>
                    </label>
                    <span className={`pill ${a.status === "done" ? "pill-green" : a.status === "in_progress" ? "pill-amber" : "pill-gray"}`}>
                      {a.status === "done" ? "Done" : a.status === "in_progress" ? "In progress" : "Open"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-12 lg:col-span-5 card">
              <div className="card-head">
                <div className="flex flex-col gap-0.5">
                  <span>Documents</span>
                  <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>
                    Auto-pulled from intake form, Plaid statements, and Karli uploads
                  </span>
                </div>
                <button className="btn-ghost btn text-xs normal-case">Upload</button>
              </div>
              <ul>
                {(client.documents || []).map((d: any, i: number) => (
                  <li key={i} className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: "var(--line)" }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded bg-[var(--brand-soft)] text-[var(--brand-dark)] flex items-center justify-center text-xs font-semibold shrink-0">{d.tag.slice(0,2).toUpperCase()}</div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{d.name}</div>
                        <div className="text-xs flex items-center gap-1.5 flex-wrap" style={{ color: "var(--ink-soft)" }}>
                          <span>{d.tag}</span>
                          <span>·</span>
                          <span>{d.uploaded_at}</span>
                          <span>·</span>
                          <span className="pill pill-gray" style={{ fontSize: 10, padding: "1px 6px" }}>{d.source}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-xs shrink-0" style={{ color: "var(--brand)" }}>view</button>
                  </li>
                ))}
                {(!client.documents || client.documents.length === 0) && <li className="px-5 py-3 text-sm" style={{ color: "var(--ink-soft)" }}>No documents yet — they'll appear here as the client uploads via the intake form.</li>}
              </ul>
            </div>

            {client.plaidAccounts && (
              <div className="col-span-12 lg:col-span-7 card">
                <div className="card-head">
                  <div className="flex flex-col gap-0.5">
                    <span>Connected accounts</span>
                    <span className="text-[10px] normal-case font-normal tracking-normal flex items-center gap-1" style={{ color: "var(--ink-soft)" }}>
                      <PlaidGlyph /> Synced via Plaid · balances refresh nightly
                    </span>
                  </div>
                  <button className="btn-ghost btn text-xs normal-case">+ Link account</button>
                </div>
                <ul>
                  {(client.plaidAccounts || []).map((p: any, i: number) => (
                    <li key={i} className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: "var(--line)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded bg-[#eef4f8] text-[#155e8a] flex items-center justify-center text-xs font-semibold">{p.institution.slice(0,2).toUpperCase()}</div>
                        <div>
                          <div className="text-sm font-medium">{p.institution} <span className="text-xs font-normal" style={{ color: "var(--ink-soft)" }}>{p.mask}</span></div>
                          <div className="text-xs" style={{ color: "var(--ink-soft)" }}>{p.type} · last sync {p.lastSync}</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium tabular-nums">{p.balance.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {client.intakeResponses && (
              <div className={`col-span-12 ${client.plaidAccounts ? "lg:col-span-5" : ""} card`}>
                <div className="card-head">
                  <div className="flex flex-col gap-0.5">
                    <span>Intake form responses</span>
                    <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>
                      Submitted by client on {client.meetings[client.meetings.length - 1]?.date}
                    </span>
                  </div>
                  <button className="btn-ghost btn text-xs normal-case">View full intake</button>
                </div>
                <ul>
                  {(client.intakeResponses || client.intake_responses || []).map((r: any, i: number) => (
                    <li key={i} className="px-5 py-2.5 border-t" style={{ borderColor: "var(--line)" }}>
                      <div className="text-xs font-medium" style={{ color: "var(--ink-soft)" }}>{r.question}</div>
                      <div className="text-sm mt-0.5">{r.answer}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="col-span-12 card">
              <div className="card-head">
                <div className="flex flex-col gap-0.5">
                  <span>Cadence & timeline</span>
                  <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>
                    Auto-fired reminders driven by your engagement type, intake answers, and policy/renewal dates · emails sent to you and the client
                  </span>
                </div>
                <button className="btn-ghost btn text-xs normal-case">+ Custom reminder</button>
              </div>
              <ul>
                {buildCadence(client).map((c: any, i: number) => (
                  <li key={i} className="px-5 py-3 border-t flex items-center gap-4" style={{ borderColor: "var(--line)" }}>
                    <div className="w-32 shrink-0">
                      <div className="text-xs font-semibold">{c.date}</div>
                      <div className="text-[10px]" style={{ color: "var(--ink-soft)" }}>{c.relative}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{c.title}</div>
                      <div className="text-xs flex items-center gap-1.5 flex-wrap" style={{ color: "var(--ink-soft)" }}>
                        <span className="pill pill-gray" style={{ fontSize: 10, padding: "1px 6px" }}>Cadence engine</span>
                        <span>·</span>
                        <span>{c.basis}</span>
                      </div>
                    </div>
                    <span className={`pill ${c.status === "fired" ? "pill-green" : c.status === "imminent" ? "pill-amber" : "pill-gray"}`}>
                      {c.status === "fired" ? "Sent" : c.status === "imminent" ? "Upcoming" : "Scheduled"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-12 card">
              <div className="card-head">
                <div className="flex flex-col gap-0.5">
                  <span>Meeting log</span>
                  <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>
                    Auto-synced from Google Calendar · transcripts via Fathom
                  </span>
                </div>
              </div>
              <ul>
                {(client.meetings || []).map((m: any, i: number) => (
                  <li key={i} className="px-5 py-3 border-t flex gap-4" style={{ borderColor: "var(--line)" }}>
                    <div className="w-28 text-xs font-medium shrink-0">{m.meeting_date || m.date}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium flex items-center gap-2">{m.title} <SourceBadge source="Google Cal" /></div>
                      <div className="text-sm" style={{ color: "var(--ink-soft)" }}>{m.summary}</div>
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

function Donut({ data }: { data: { category: string; value: number; pct: number }[] }) {  const r = 60, c = 80, stroke = 22;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 160 160" width="100%" style={{ maxWidth: 220 }}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="#eef0ee" strokeWidth={stroke} />
      {data.map((d, i) => {
        const len = (d.pct / 100) * circ;
        const dash = `${len} ${circ - len}`;
        const dashoffset = -offset;
        offset += len;
        return (
          <circle key={i} cx={c} cy={c} r={r} fill="none"
            stroke={categoryColor[d.category] ?? "#ccc"}
            strokeWidth={stroke}
            strokeDasharray={dash}
            strokeDashoffset={dashoffset}
            transform={`rotate(-90 ${c} ${c})`}
          />
        );
      })}
      <text x={c} y={c - 4} textAnchor="middle" fontSize="11" fill="var(--ink-soft)">Allocation</text>
      <text x={c} y={c + 14} textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--ink)">{data.length} types</text>
    </svg>
  );
}

function SourceBadge({ source }: { source: string }) {
  const palette: Record<string, { bg: string; fg: string; label: string }> = {
    "Google Cal": { bg: "#e8f0fe", fg: "#1a73e8", label: "Google Cal" },
    "Gmail": { bg: "#fce8e6", fg: "#c5221f", label: "Gmail" },
    "Calendly": { bg: "#e7f0ff", fg: "#0069ff", label: "Calendly" },
    "Plaid": { bg: "#eef4f8", fg: "#155e8a", label: "Plaid" },
    "Fathom": { bg: "#f1ecfe", fg: "#5b3dbe", label: "Fathom" },
  };
  const p = palette[source] ?? { bg: "#eef0ee", fg: "#4a544f", label: source };
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide" style={{ background: p.bg, color: p.fg }}>
      {p.label}
    </span>
  );
}

function PlaidGlyph() {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide" style={{ background: "#eef4f8", color: "#155e8a" }}>
      Plaid
    </span>
  );
}

function buildCadence(c: any) {
  const today = new Date("2025-02-08");
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const rel = (d: Date) => {
    const days = Math.round((+d - +today) / 86400000);
    if (days < 0) return `${-days}d ago`;
    if (days === 0) return "today";
    if (days < 31) return `in ${days}d`;
    return `in ${Math.round(days / 30)}mo`;
  };
  const lastMeeting = c.last_contact ? new Date(c.last_contact) : new Date();
  const add = (base: Date, days: number) => { const x = new Date(base); x.setDate(x.getDate() + days); return x; };
  const d30 = add(lastMeeting, 30);
  const d180 = add(lastMeeting, 180);
  const dAnnual = add(lastMeeting, 365);
  const status = (d: Date): "fired" | "imminent" | "scheduled" =>
    d < today ? "fired" : (+d - +today) < 14 * 86400000 ? "imminent" : "scheduled";

  const items: { date: string; relative: string; title: string; basis: string; status: "fired" | "imminent" | "scheduled" }[] = [
    { date: fmt(d30), relative: rel(d30), title: "30-day post-plan follow-up", basis: "Royal Oak / Sycamore / Mahogany default", status: status(d30) },
    { date: fmt(d180), relative: rel(d180), title: "6-month review reminder", basis: "Brochure cadence", status: status(d180) },
    { date: fmt(dAnnual), relative: rel(dAnnual), title: "Annual estate & beneficiary review", basis: "Triggered by 'has will/trust' = yes", status: status(dAnnual) },
  ];

  if (c.id === "anita") {
    const rmd = new Date("2025-12-31");
    items.push({ date: fmt(rmd), relative: rel(rmd), title: "Required Minimum Distribution deadline", basis: "Triggered by IRA + age from intake", status: status(rmd) });
  }
  if (c.id === "dayanara") {
    const policy = new Date("2025-04-15");
    const tax = new Date("2025-04-15");
    items.push({ date: fmt(policy), relative: rel(policy), title: "Term life policy: convertibility check", basis: "Triggered by intake answer", status: status(policy) });
    items.push({ date: fmt(tax), relative: rel(tax), title: "2024 tax filing deadline check-in", basis: "Triggered by 'taxes incomplete' action item", status: status(tax) });
  }
  if (c.plan === "Mahogany") {
    const events = new Date("2025-05-15");
    items.push({ date: fmt(events), relative: rel(events), title: "Curated client event invite", basis: "Mahogany tier benefit", status: status(events) });
  }

  return items.sort((a, b) => +new Date(a.date) - +new Date(b.date));
}

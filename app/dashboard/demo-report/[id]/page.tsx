import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientById } from "../../../../utils/supabase/queries";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const fmtUSD = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

type ReportType = "snapshot" | "net-worth";

const REPORT_META: Record<ReportType, { title: string; subtitle: string; phaseNote: string }> = {
  snapshot: {
    title: "Client Financial Snapshot",
    subtitle: "A one-page personalized overview of the client's financial picture, recommended plan tier, and engagement scope. Designed to be sent after the intake review.",
    phaseNote: "This is a demo of what an auto-generated PDF would look like once Phase 2 reporting is integrated. Data shown is live from the client's intake — the layout is illustrative.",
  },
  "net-worth": {
    title: "Net Worth Statement",
    subtitle: "A formatted balance sheet listing all assets and liabilities with category subtotals — the document lenders, CPAs, and estate attorneys typically request.",
    phaseNote: "This is a demo of what an exportable PDF would look like once Phase 2 reporting is integrated. Data shown is live from the client's intake — the layout is illustrative.",
  },
};

export default async function DemoReport({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const type: ReportType = sp.type === "net-worth" ? "net-worth" : "snapshot";
  const c = await getClientById(id);
  if (!c) return notFound();

  const meta = REPORT_META[type];
  const totalAssets = (c.assets || []).reduce((s: number, a: any) => s + Number(a.value), 0);
  const totalLiab = (c.liabilities || []).reduce((s: number, l: any) => s + Number(l.balance), 0);
  const netWorth = totalAssets - totalLiab;
  const annualIncome = (c.income || []).reduce((s: number, x: any) => s + Number(x.annual), 0);
  const monthlyExpenses = (c.expenses || []).reduce((s: number, x: any) => s + Number(x.monthly), 0);

  const assetCategories = (c.assets || []).reduce((acc: Record<string, number>, a: any) => {
    acc[a.category] = (acc[a.category] || 0) + Number(a.value);
    return acc;
  }, {});

  return (
    <div className="min-h-screen py-8" style={{ background: "var(--bg)" }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between mb-4">
          <Link href={`/dashboard/clients/${c.id}`} className="text-sm font-medium" style={{ color: "var(--brand)" }}>
            ← Back to client profile
          </Link>
          <div className="flex gap-2">
            <Link href={`/dashboard/demo-report/${c.id}?type=snapshot`} className={`btn-ghost btn ${type === 'snapshot' ? 'border-[var(--brand)] text-[var(--brand-dark)]' : ''}`}>
              Financial Snapshot
            </Link>
            <Link href={`/dashboard/demo-report/${c.id}?type=net-worth`} className={`btn-ghost btn ${type === 'net-worth' ? 'border-[var(--brand)] text-[var(--brand-dark)]' : ''}`}>
              Net Worth Statement
            </Link>
          </div>
        </div>

        <div className="rounded-lg border-2 border-dashed mb-4 p-4 flex items-start gap-3" style={{ borderColor: "#c08a3e", background: "#fdf6ec" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c08a3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <div className="text-sm font-semibold" style={{ color: "#8a5a3b" }}>Demo Report</div>
            <div className="text-xs mt-1" style={{ color: "#8a5a3b" }}>{meta.phaseNote}</div>
          </div>
        </div>

        <div className="card" style={{ background: "#fff" }}>
          <div className="card-pad" style={{ paddingTop: 40, paddingBottom: 40 }}>
            <div className="flex items-start justify-between gap-6 mb-8 pb-6 border-b" style={{ borderColor: "var(--line)" }}>
              <div className="flex items-center gap-3">
                <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                  <path d="M16 6c-2 0-3 1-3 2v2h6V8c0-1-1-2-3-2z" fill="#c08a3e" />
                  <path d="M9 12h14c0 6-3 12-7 12s-7-6-7-12z" fill="#2f7d4f" />
                </svg>
                <div>
                  <div className="text-lg font-semibold tracking-tight">Acorn Care, LLC</div>
                  <div className="text-xs" style={{ color: "var(--ink-soft)" }}>Concierge Financial Planning</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--ink-soft)" }}>{meta.title}</div>
                <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>Prepared {new Date().toLocaleDateString()}</div>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--ink-soft)" }}>Prepared for</div>
              <div className="text-2xl font-semibold tracking-tight">{c.name}</div>
              {c.family && <div className="text-sm mt-1" style={{ color: "var(--ink-soft)" }}>{c.family}</div>}
            </div>

            <div className="text-sm leading-relaxed mb-8 italic" style={{ color: "var(--ink-soft)" }}>
              {meta.subtitle}
            </div>

            {type === "snapshot" ? (
              <SnapshotBody c={c} netWorth={netWorth} totalAssets={totalAssets} totalLiab={totalLiab} annualIncome={annualIncome} monthlyExpenses={monthlyExpenses} assetCategories={assetCategories} />
            ) : (
              <NetWorthBody c={c} totalAssets={totalAssets} totalLiab={totalLiab} netWorth={netWorth} />
            )}

            <div className="mt-12 pt-6 border-t text-[10px] text-center" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>
              Acorn Care, LLC · Concierge Financial Planning · This document is illustrative and does not constitute investment advice.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SnapshotBody({ c, netWorth, totalAssets, totalLiab, annualIncome, monthlyExpenses, assetCategories }: any) {
  return (
    <>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <KpiCard label="Net worth" value={fmtUSD(netWorth)} accent="brand" />
        <KpiCard label="Annual income" value={fmtUSD(annualIncome)} />
        <KpiCard label="Monthly expenses" value={fmtUSD(monthlyExpenses)} />
      </div>

      <Section title="Recommended plan">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-xl font-semibold tracking-tight">{c.plan === "Intake" ? "Sycamore" : c.plan}</span>
          <span className="text-sm" style={{ color: "var(--ink-soft)" }}>tier</span>
        </div>
        <div className="text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Based on net worth, complexity of income sources, and stated goals, we recommend the {c.plan === "Intake" ? "Sycamore" : c.plan} engagement. This includes ongoing planning, two formal review meetings per year, and unlimited ad-hoc questions.
        </div>
      </Section>

      <Section title="Asset allocation">
        <div className="flex flex-col gap-2">
          {Object.entries(assetCategories).map(([cat, val]: any) => {
            const pct = totalAssets ? (val / totalAssets) * 100 : 0;
            return (
              <div key={cat} className="flex items-center gap-3">
                <div className="w-32 text-sm">{cat}</div>
                <div className="flex-1 h-5 rounded-sm overflow-hidden" style={{ background: "#eef0ee" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "var(--brand)" }} />
                </div>
                <div className="w-28 text-sm tabular-nums text-right">{fmtUSD(val)}</div>
                <div className="w-12 text-xs tabular-nums text-right" style={{ color: "var(--ink-soft)" }}>{pct.toFixed(0)}%</div>
              </div>
            );
          })}
        </div>
      </Section>

      {c.goals && Array.isArray(c.goals) && c.goals.length > 0 && (
        <Section title="Top stated goals">
          <ul className="text-sm leading-relaxed space-y-1.5" style={{ color: "var(--ink)" }}>
            {(c.goals as string[]).slice(0, 5).map((g, i) => (
              <li key={i} className="flex gap-2"><span style={{ color: "var(--brand)" }}>•</span><span>{g}</span></li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Engagement scope">
        <ul className="text-sm leading-relaxed space-y-1.5" style={{ color: "var(--ink)" }}>
          <li className="flex gap-2"><span style={{ color: "var(--brand)" }}>✓</span><span>Comprehensive financial plan + annual updates</span></li>
          <li className="flex gap-2"><span style={{ color: "var(--brand)" }}>✓</span><span>Two two-hour review meetings per year</span></li>
          <li className="flex gap-2"><span style={{ color: "var(--brand)" }}>✓</span><span>Tax-loss harvesting + Roth conversion analysis</span></li>
          <li className="flex gap-2"><span style={{ color: "var(--brand)" }}>✓</span><span>Estate document review and attorney referrals</span></li>
          <li className="flex gap-2"><span style={{ color: "var(--brand)" }}>✓</span><span>Insurance coverage audit (life, disability, P&C)</span></li>
        </ul>
      </Section>
    </>
  );
}

function NetWorthBody({ c, totalAssets, totalLiab, netWorth }: any) {
  return (
    <>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <KpiCard label="Total assets" value={fmtUSD(totalAssets)} />
        <KpiCard label="Total liabilities" value={fmtUSD(totalLiab)} />
        <KpiCard label="Net worth" value={fmtUSD(netWorth)} accent="brand" />
      </div>

      <Section title="Assets">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>
              <th className="py-2 text-[11px] uppercase tracking-wider font-semibold">Account</th>
              <th className="py-2 text-[11px] uppercase tracking-wider font-semibold">Category</th>
              <th className="py-2 text-[11px] uppercase tracking-wider font-semibold text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {(c.assets || []).map((a: any) => (
              <tr key={a.id} className="border-b" style={{ borderColor: "var(--line)" }}>
                <td className="py-2.5">{a.label}</td>
                <td className="py-2.5" style={{ color: "var(--ink-soft)" }}>{a.category}</td>
                <td className="py-2.5 tabular-nums text-right">{fmtUSD(Number(a.value))}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={2} className="py-2.5 font-semibold">Total assets</td>
              <td className="py-2.5 tabular-nums text-right font-semibold">{fmtUSD(totalAssets)}</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section title="Liabilities">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>
              <th className="py-2 text-[11px] uppercase tracking-wider font-semibold">Liability</th>
              <th className="py-2 text-[11px] uppercase tracking-wider font-semibold">Rate</th>
              <th className="py-2 text-[11px] uppercase tracking-wider font-semibold text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {(c.liabilities || []).map((l: any) => (
              <tr key={l.id} className="border-b" style={{ borderColor: "var(--line)" }}>
                <td className="py-2.5">{l.label}</td>
                <td className="py-2.5" style={{ color: "var(--ink-soft)" }}>{l.rate ? `${l.rate}%` : "—"}</td>
                <td className="py-2.5 tabular-nums text-right">{fmtUSD(Number(l.balance))}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={2} className="py-2.5 font-semibold">Total liabilities</td>
              <td className="py-2.5 tabular-nums text-right font-semibold">{fmtUSD(totalLiab)}</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section title="Net worth summary">
        <div className="flex items-baseline justify-between p-4 rounded-lg" style={{ background: "var(--brand-soft)" }}>
          <span className="text-sm font-semibold" style={{ color: "var(--brand-dark)" }}>Total net worth</span>
          <span className="text-2xl font-semibold tabular-nums" style={{ color: "var(--brand-dark)" }}>{fmtUSD(netWorth)}</span>
        </div>
      </Section>
    </>
  );
}

function KpiCard({ label, value, accent }: { label: string; value: string; accent?: "brand" }) {
  return (
    <div className="border rounded-lg p-4" style={{ borderColor: "var(--line)", background: accent === "brand" ? "var(--brand-soft)" : "transparent" }}>
      <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--ink-soft)" }}>{label}</div>
      <div className="text-xl font-semibold tabular-nums mt-1" style={{ color: accent === "brand" ? "var(--brand-dark)" : "var(--ink)" }}>{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="text-[11px] uppercase tracking-wider font-semibold mb-3 pb-2 border-b" style={{ color: "var(--ink-soft)", borderColor: "var(--line)" }}>{title}</div>
      {children}
    </div>
  );
}

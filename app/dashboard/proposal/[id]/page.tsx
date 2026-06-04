import { notFound } from "next/navigation";
import Link from "next/link";
import { clients, fmtUSD, netWorth } from "../../../../lib/data";

export default async function Proposal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = clients.find((x) => x.id === id);
  if (!c) return notFound();
  const nw = netWorth(c);

  return (
    <div className="min-h-screen py-10" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center justify-between mb-4">
          <Link href={`/clients/${c.id}`} className="text-sm" style={{ color: "var(--brand)" }}>← Back to client</Link>
          <div className="flex gap-2">
            <button className="btn-ghost btn">Email to client</button>
            <button className="btn">Download PDF</button>
          </div>
        </div>

        <div className="card" style={{ background: "#fff" }}>
          <div className="card-pad" style={{ paddingTop: 36, paddingBottom: 36 }}>
            <div className="flex items-center gap-3 mb-8 pb-6 border-b" style={{ borderColor: "var(--line)" }}>
              <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                <path d="M16 6c-2 0-3 1-3 2v2h6V8c0-1-1-2-3-2z" fill="#c08a3e"/>
                <path d="M9 12h14c0 6-3 12-7 12s-7-6-7-12z" fill="#2f7d4f"/>
              </svg>
              <div>
                <div className="text-base font-semibold">Acorn Care, LLC</div>
                <div className="text-xs" style={{ color: "var(--ink-soft)" }}>Concierge Financial Planning · Karli Vazquez-Mendez</div>
              </div>
              <div className="ml-auto text-xs text-right" style={{ color: "var(--ink-soft)" }}>
                Prepared for<br />
                <span className="text-[var(--ink)] font-semibold text-sm">{c.name}</span>
              </div>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight mb-1">Financial Plan Proposal</h1>
            <div className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>{c.plan} Plan · {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>

            <Section title="Current Goals">
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {c.goals.map((g, i) => <li key={i}>{g}</li>)}
              </ul>
            </Section>

            <Section title="Personal Financial Statement Summary">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <Stat label="Total assets" value={fmtUSD(nw.assets)} />
                <Stat label="Total liabilities" value={fmtUSD(nw.liabilities)} />
                <Stat label="Net worth" value={fmtUSD(nw.net)} accent />
              </div>
            </Section>

            <Section title="Plan Implementation">
              <ul className="space-y-2 text-sm">
                {c.actions.filter(a => a.status !== "done").map((a) => (
                  <li key={a.id} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] mt-2 shrink-0" />
                    <span>
                      <span className="font-medium">{a.title}</span>
                      <span className="text-xs ml-2" style={{ color: "var(--ink-soft)" }}>
                        {a.owner === "Karli" ? "Acorn Care" : "Client"}{a.due && ` · target ${a.due}`}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Professional Team">
              <ul className="text-sm divide-y" style={{ borderColor: "var(--line)" }}>
                {c.team.map((t, i) => (
                  <li key={i} className="flex justify-between py-1.5">
                    <span><span className="font-medium">{t.role}</span> — {t.name}</span>
                    <span className="text-xs" style={{ color: "var(--ink-soft)" }}>{t.firm ?? ""}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Engagement & Cadence">
              <p className="text-sm">
                {c.plan} Plan engagement includes a 2-hour plan review, 30-day follow-up, and periodic check-ins
                {c.plan === "Mahogany" ? " plus priority access and curated client events" : ""}.
                Investment of services per the agreed engagement letter, billed 50% upon engagement and 50% upon plan delivery.
              </p>
            </Section>

            <div className="mt-10 pt-6 border-t text-xs" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>
              Acorn Care, LLC is an independent concierge financial planning firm and is not affiliated with any banking institution.
              The contents of this document are for informational purposes only and do not constitute investment, tax, or legal advice.
              Projections are based on assumptions provided by the client and are not guaranteed. Consult your tax and/or legal advisor
              before implementing any tax or legal strategies.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <h3 className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--brand)" }}>{title}</h3>
      {children}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="card card-pad">
      <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--ink-soft)" }}>{label}</div>
      <div className="text-xl font-semibold mt-1" style={{ color: accent ? "var(--brand)" : "var(--ink)" }}>{value}</div>
    </div>
  );
}

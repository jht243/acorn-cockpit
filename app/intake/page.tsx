"use client";
import { useState } from "react";
import Link from "next/link";

type Asset = { label: string; value: string; category: string };
type Liability = { label: string; balance: string; rate: string };

export default function Intake() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    clientName: "",
    spouseName: "",
    dob: "",
    spouseDob: "",
    email: "",
    phone: "",
    address: "",
    children: "",
    assets: [{ label: "", value: "", category: "Cash" }] as Asset[],
    liabilities: [{ label: "", balance: "", rate: "" }] as Liability[],
    annualIncome: "",
    monthlyExpenses: "",
    risk: "Moderate",
    hasWill: "no",
    hasTrust: "no",
    hasLifeIns: "no",
    estatePlanNotes: "",
    goals: "",
    largestObstacle: "",
  });

  const steps = ["Welcome", "About you", "Family", "Connect accounts", "Assets", "Liabilities", "Income & expenses", "Estate & insurance", "Goals", "Documents", "Review"];

  const update = (k: string, v: any) => setData((d) => ({ ...d, [k]: v }));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <header className="bg-white border-b py-4 px-6 flex items-center justify-between" style={{ borderColor: "var(--line)" }}>
        <div className="flex items-center gap-2">
          <Logo />
          <div>
            <div className="text-sm font-semibold">Acorn Care</div>
            <div className="text-xs" style={{ color: "var(--ink-soft)" }}>Concierge Financial Planning</div>
          </div>
        </div>
        <div className="text-sm" style={{ color: "var(--ink-soft)" }}>Secure intake · saves as you go</div>
      </header>

      <div className="flex-1 max-w-3xl w-full mx-auto p-6">
        <Stepper steps={steps} current={step} />

        <div className="card mt-6">
          <div className="card-pad">
            {step === 0 && (
              <Welcome onNext={() => setStep(1)} />
            )}

            {step === 1 && (
              <Section title="About you" subtitle="The basics — we'll keep this confidential.">
                <Grid>
                  <Field label="Your full name"><input className="input" value={data.clientName} onChange={(e) => update("clientName", e.target.value)} placeholder="Jane Doe" /></Field>
                  <Field label="Date of birth"><input type="date" className="input" value={data.dob} onChange={(e) => update("dob", e.target.value)} /></Field>
                  <Field label="Email"><input className="input" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="jane@example.com" /></Field>
                  <Field label="Phone"><input className="input" value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="305-555-1234" /></Field>
                  <Field label="Mailing address" full><input className="input" value={data.address} onChange={(e) => update("address", e.target.value)} placeholder="Street, City, State, ZIP" /></Field>
                  <Field label="Spouse / partner name (optional)"><input className="input" value={data.spouseName} onChange={(e) => update("spouseName", e.target.value)} placeholder="" /></Field>
                  <Field label="Spouse DOB (optional)"><input type="date" className="input" value={data.spouseDob} onChange={(e) => update("spouseDob", e.target.value)} /></Field>
                </Grid>
              </Section>
            )}

            {step === 2 && (
              <Section title="Family" subtitle="Who do we need to plan around?">
                <Field label="Children & other dependents" full>
                  <textarea className="textarea" rows={4} value={data.children} onChange={(e) => update("children", e.target.value)}
                    placeholder="e.g., Maya (12), Liam (9), my mother lives with us part-time" />
                </Field>
              </Section>
            )}

            {step === 3 && (
              <Section title="Connect your accounts" subtitle="Optional — this is the fastest way to give us an accurate picture. We use Plaid (the same tech your bank uses). Your credentials are never stored by Acorn Care.">
                <div className="card card-pad" style={{ background: "#f9fbfa" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded bg-[#eef4f8] text-[#155e8a] flex items-center justify-center text-xs font-bold">P</div>
                    <div>
                      <div className="text-sm font-semibold">Link via Plaid</div>
                      <div className="text-xs" style={{ color: "var(--ink-soft)" }}>Banks, brokerages, retirement, credit cards · 12,000+ institutions</div>
                    </div>
                  </div>
                  <button type="button" className="btn w-full justify-center">Connect an account</button>
                  <div className="text-[11px] mt-3" style={{ color: "var(--ink-soft)" }}>
                    Read-only access. We see balances and account types — never your password. Disconnect any time.
                  </div>
                </div>
                <div className="text-xs mt-4 text-center" style={{ color: "var(--ink-soft)" }}>Prefer not to link? You can enter accounts manually in the next step.</div>
              </Section>
            )}

            {step === 4 && (
              <Section title="Assets (manual entry)" subtitle="Add anything Plaid couldn't pull — real estate, business, private investments. Estimates are fine.">
                <ItemList
                  items={data.assets}
                  onChange={(items) => update("assets", items)}
                  renderRow={(item, set) => (
                    <>
                      <input className="input flex-[2]" placeholder="e.g., Lighthouse Point home" value={item.label} onChange={(e) => set({ ...item, label: e.target.value })} />
                      <input className="input flex-1" placeholder="$ value" value={item.value} onChange={(e) => set({ ...item, value: e.target.value })} />
                      <select className="select flex-1" value={item.category} onChange={(e) => set({ ...item, category: e.target.value })}>
                        {["Cash", "Taxable", "Qualified", "Roth", "Real Estate", "Business"].map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </>
                  )}
                  blank={{ label: "", value: "", category: "Real Estate" }}
                  addLabel="+ Add asset"
                />
              </Section>
            )}

            {step === 5 && (
              <Section title="Liabilities" subtitle="Mortgages, loans, credit lines.">
                <ItemList
                  items={data.liabilities}
                  onChange={(items) => update("liabilities", items)}
                  renderRow={(item, set) => (
                    <>
                      <input className="input flex-[2]" placeholder="e.g., Wells Fargo Mortgage" value={item.label} onChange={(e) => set({ ...item, label: e.target.value })} />
                      <input className="input flex-1" placeholder="Balance" value={item.balance} onChange={(e) => set({ ...item, balance: e.target.value })} />
                      <input className="input flex-1" placeholder="Rate %" value={item.rate} onChange={(e) => set({ ...item, rate: e.target.value })} />
                    </>
                  )}
                  blank={{ label: "", balance: "", rate: "" }}
                  addLabel="+ Add liability"
                />
              </Section>
            )}

            {step === 6 && (
              <Section title="Income & expenses" subtitle="Rough numbers are fine — we'll refine in our meeting.">
                <Grid>
                  <Field label="Total annual income"><input className="input" placeholder="$ / year" value={data.annualIncome} onChange={(e) => update("annualIncome", e.target.value)} /></Field>
                  <Field label="Total monthly expenses"><input className="input" placeholder="$ / month" value={data.monthlyExpenses} onChange={(e) => update("monthlyExpenses", e.target.value)} /></Field>
                  <Field label="Financial risk tolerance" full>
                    <div className="flex gap-2">
                      {["Conservative", "Moderate", "Aggressive"].map((r) => (
                        <button key={r} type="button"
                          onClick={() => update("risk", r)}
                          className={`flex-1 py-2 px-3 rounded-md border text-sm ${data.risk === r ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] font-medium" : "border-[var(--line)] bg-white"}`}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </Field>
                </Grid>
              </Section>
            )}

            {step === 7 && (
              <Section title="Estate & insurance" subtitle="What's already in place?">
                <Grid>
                  <YN label="Do you have a will?" value={data.hasWill} onChange={(v) => update("hasWill", v)} />
                  <YN label="Do you have a trust?" value={data.hasTrust} onChange={(v) => update("hasTrust", v)} />
                  <YN label="Do you have life insurance?" value={data.hasLifeIns} onChange={(v) => update("hasLifeIns", v)} />
                </Grid>
                <Field label="Anything else we should know about your estate plan?" full>
                  <textarea className="textarea" rows={3} value={data.estatePlanNotes} onChange={(e) => update("estatePlanNotes", e.target.value)} />
                </Field>
              </Section>
            )}

            {step === 8 && (
              <Section title="Goals" subtitle="What are you trying to accomplish in the next 1–10 years?">
                <Field label="Your top goals" full>
                  <textarea className="textarea" rows={5} value={data.goals} onChange={(e) => update("goals", e.target.value)}
                    placeholder="e.g., Retire by 60, buy a vacation home, set up a 529 for our kids…" />
                </Field>
                <Field label="Your largest obstacle in achieving them" full>
                  <textarea className="textarea" rows={3} value={data.largestObstacle} onChange={(e) => update("largestObstacle", e.target.value)} />
                </Field>
              </Section>
            )}

            {step === 9 && (
              <Section title="Documents" subtitle="Drop in anything you have. You can keep adding later.">
                <Drop />
                <ul className="mt-4 space-y-1.5 text-sm">
                  {[
                    "Most recent tax return",
                    "Account statements (investments, retirement, savings)",
                    "Insurance policy declarations",
                    "Will / trust documents",
                    "Mortgage / loan statements",
                    "Most recent pay stub",
                  ].map((s) => (
                    <li key={s} className="flex items-center gap-2" style={{ color: "var(--ink-soft)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                      {s}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {step === 10 && (
              <Section title="Review & submit" subtitle="Karli will review and reach out within 1 business day.">
                <ReviewBlock label="Name" value={data.clientName || "—"} />
                <ReviewBlock label="Email" value={data.email || "—"} />
                <ReviewBlock label="Phone" value={data.phone || "—"} />
                <ReviewBlock label="Spouse" value={data.spouseName || "—"} />
                <ReviewBlock label="Assets" value={`${data.assets.filter(a => a.label).length} added`} />
                <ReviewBlock label="Liabilities" value={`${data.liabilities.filter(l => l.label).length} added`} />
                <ReviewBlock label="Annual income" value={data.annualIncome ? `$${data.annualIncome}` : "—"} />
                <ReviewBlock label="Monthly expenses" value={data.monthlyExpenses ? `$${data.monthlyExpenses}` : "—"} />
                <ReviewBlock label="Risk tolerance" value={data.risk} />
                <ReviewBlock label="Goals" value={data.goals || "—"} multiline />
                <div className="text-xs mt-4" style={{ color: "var(--ink-soft)" }}>
                  By submitting, you agree Acorn Care, LLC may use this information to prepare a financial plan proposal.
                  Acorn Care is not affiliated with any banking institution and this is not investment advice.
                </div>
              </Section>
            )}
          </div>

          {step > 0 && (
            <div className="card-pad border-t flex items-center justify-between" style={{ borderColor: "var(--line)" }}>
              <button className="btn-ghost btn" onClick={() => setStep(Math.max(0, step - 1))}>← Back</button>
              <div className="flex items-center gap-3">
                <span className="text-xs" style={{ color: "var(--ink-soft)" }}>Step {step} of {steps.length - 1}</span>
                {step < steps.length - 1 ? (
                  <button className="btn" onClick={() => setStep(step + 1)}>Continue →</button>
                ) : (
                  <button 
                    className="btn" 
                    onClick={async () => {
                      const { submitIntake } = await import('./actions');
                      const res = await submitIntake(data);
                      if (res.success) {
                        window.location.href = '/intake/thanks';
                      } else {
                        alert('There was an error submitting your intake. Please try again.');
                      }
                    }}
                  >
                    Submit intake →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center py-6">
      <div className="flex justify-center mb-3"><Logo size={40} /></div>
      <h2 className="text-2xl font-semibold tracking-tight mb-2">Welcome to Acorn Care.</h2>
      <p className="text-sm max-w-md mx-auto mb-1" style={{ color: "var(--ink-soft)" }}>
        This intake takes about 15–20 minutes. Your progress saves automatically — you can come back to it any time.
      </p>
      <p className="text-sm max-w-md mx-auto mb-6" style={{ color: "var(--ink-soft)" }}>
        Estimates are fine. We'll refine the numbers together in your plan review.
      </p>
      <button className="btn" onClick={onNext}>Begin →</button>
      <div className="mt-8 grid grid-cols-3 gap-3 max-w-lg mx-auto text-xs" style={{ color: "var(--ink-soft)" }}>
        <div className="card card-pad"><div className="font-semibold text-[var(--ink)] mb-1">10 sections</div>Family, assets, goals, documents.</div>
        <div className="card card-pad"><div className="font-semibold text-[var(--ink)] mb-1">Encrypted</div>Your data is encrypted at rest.</div>
        <div className="card card-pad"><div className="font-semibold text-[var(--ink)] mb-1">Save & resume</div>Pause anytime; magic link to return.</div>
      </div>
    </div>
  );
}

function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {steps.map((s, i) => (
        <div key={i} className="flex-1 flex items-center gap-1.5">
          <div className={`h-1.5 flex-1 rounded-full ${i <= current ? "bg-[var(--brand)]" : "bg-[var(--line)]"}`} />
        </div>
      ))}
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm mb-5" style={{ color: "var(--ink-soft)" }}>{subtitle}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

function YN({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-2">
        {["yes", "no"].map((o) => (
          <button key={o} type="button" onClick={() => onChange(o)}
            className={`flex-1 py-2 rounded-md border text-sm capitalize ${value === o ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] font-medium" : "border-[var(--line)] bg-white"}`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function ItemList<T>({ items, onChange, renderRow, blank, addLabel }:
  { items: T[]; onChange: (items: T[]) => void; renderRow: (item: T, set: (next: T) => void) => React.ReactNode; blank: T; addLabel: string }) {
  return (
    <div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            {renderRow(item, (next) => {
              const copy = items.slice();
              copy[i] = next;
              onChange(copy);
            })}
            <button className="text-xs px-2 py-1 rounded hover:bg-red-50" style={{ color: "var(--danger)" }}
              onClick={() => onChange(items.filter((_, j) => j !== i))} title="Remove">✕</button>
          </div>
        ))}
      </div>
      <button className="btn-ghost btn mt-3" onClick={() => onChange([...items, blank])}>{addLabel}</button>
    </div>
  );
}

function Drop() {
  return (
    <label className="block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-white transition" style={{ borderColor: "var(--line)" }}>
      <input type="file" multiple className="hidden" />
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.5" className="mx-auto mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>
      <div className="text-sm font-medium">Click to upload, or drag & drop</div>
      <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>PDF, DOCX, JPG, PNG · up to 25 MB each</div>
    </label>
  );
}

function ReviewBlock({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="flex gap-4 py-2 border-b" style={{ borderColor: "var(--line)" }}>
      <div className="text-sm font-medium w-40 shrink-0" style={{ color: "var(--ink-soft)" }}>{label}</div>
      <div className={`text-sm flex-1 ${multiline ? "whitespace-pre-wrap" : ""}`}>{value}</div>
    </div>
  );
}

function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 6c-2 0-3 1-3 2v2h6V8c0-1-1-2-3-2z" fill="#c08a3e"/>
      <path d="M9 12h14c0 6-3 12-7 12s-7-6-7-12z" fill="#2f7d4f"/>
    </svg>
  );
}

import { fmtUSD } from "../lib/data";

type Insurance = {
  policy_type?: string; name?: string; carrier?: string; insured?: string; owner?: string;
  coverage_amount?: number | string | null; annual_premium?: number | string | null;
  cash_value?: number | string | null; policy_number?: string; renewal_date?: string;
  beneficiary_summary?: string; notes?: string;
};
type Estate = { doc_type?: string; in_place?: boolean; doc_date?: string; location?: string; fiduciary?: string; notes?: string };
type Beneficiary = { applies_to?: string; applies_to_type?: string; designation?: string; beneficiary?: string; share_pct?: number | string | null; notes?: string };
type Household = { name?: string; relationship?: string; date_of_birth?: string; is_dependent?: boolean; notes?: string };
type AssetRow = { label?: string; institution?: string; account_type?: string; owner?: string; as_of_date?: string; apply_rmd?: boolean };

const num = (v: number | string | null | undefined) => (typeof v === "string" ? parseFloat(v) || 0 : v ?? 0);
const money = (v: number | string | null | undefined) => (v == null || v === "" ? "—" : fmtUSD(num(v)));

function age(dob?: string): string {
  if (!dob) return "";
  const d = new Date(dob);
  if (isNaN(d.getTime())) return "";
  const now = new Date("2026-07-22");
  let a = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
  return a >= 0 ? `age ${a}` : "";
}

export default function MoreInfoCard({
  insurance = [], estate = [], beneficiaries = [], household = [], assets = [],
}: {
  insurance?: Insurance[]; estate?: Estate[]; beneficiaries?: Beneficiary[]; household?: Household[]; assets?: AssetRow[];
}) {
  const accountsWithMeta = assets.filter((a) => a.institution || a.account_type || a.owner || a.as_of_date || a.apply_rmd != null);
  const count = insurance.length + estate.length + beneficiaries.length + household.length + accountsWithMeta.length;

  return (
    <div className="col-span-12 card">
      <details className="group">
        <summary className="card-head cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
          <div className="flex flex-col gap-0.5">
            <span className="flex items-center gap-2">
              <svg className="transition-transform group-open:rotate-90" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
              More info
            </span>
            <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>
              Insurance, estate & legal, beneficiaries, household, account details
            </span>
          </div>
          <span className="pill pill-gray">{count > 0 ? `${count} item${count > 1 ? "s" : ""}` : "None yet"}</span>
        </summary>

        <div className="card-pad space-y-6">
          {count === 0 && (
            <div className="text-sm" style={{ color: "var(--ink-soft)" }}>
              No additional profile info on file yet — insurance, estate documents, beneficiaries, and household details will appear here.
            </div>
          )}

          {/* Insurance */}
          {insurance.length > 0 && (
            <Section title="Insurance">
              <div className="space-y-2">
                {insurance.map((p, i) => (
                  <div key={i} className="rounded-md border p-3" style={{ borderColor: "var(--line)" }}>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="text-sm font-medium">{p.name || p.policy_type || "Policy"}
                        {p.policy_type && <span className="pill pill-gray ml-2" style={{ fontSize: 10 }}>{p.policy_type}</span>}
                      </div>
                      <div className="text-sm font-semibold tabular-nums">{money(p.coverage_amount)}<span className="text-xs font-normal" style={{ color: "var(--ink-soft)" }}> coverage</span></div>
                    </div>
                    <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 mt-2">
                      <Field label="Carrier" value={p.carrier} />
                      <Field label="Insured" value={p.insured} />
                      <Field label="Owner" value={p.owner} />
                      <Field label="Annual premium" value={p.annual_premium != null && p.annual_premium !== "" ? money(p.annual_premium) : undefined} />
                      {num(p.cash_value) > 0 && <Field label="Cash value" value={money(p.cash_value)} />}
                      <Field label="Renewal" value={p.renewal_date} />
                      <Field label="Beneficiaries" value={p.beneficiary_summary} />
                    </dl>
                    {p.notes && <div className="text-xs mt-2" style={{ color: "var(--ink-soft)" }}>{p.notes}</div>}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Estate & legal */}
          {estate.length > 0 && (
            <Section title="Estate & legal documents">
              <ul className="rounded-md border divide-y" style={{ borderColor: "var(--line)" }}>
                {estate.map((d, i) => (
                  <li key={i} className="px-3 py-2.5 flex items-start justify-between gap-3" style={{ borderColor: "var(--line)" }}>
                    <div className="min-w-0">
                      <div className="text-sm font-medium flex items-center gap-2">
                        {d.doc_type || "Document"}
                        <span className={`pill ${d.in_place ? "pill-green" : "pill-amber"}`} style={{ fontSize: 10 }}>{d.in_place ? "In place" : "Missing"}</span>
                      </div>
                      <div className="text-xs mt-0.5 flex flex-wrap gap-x-3" style={{ color: "var(--ink-soft)" }}>
                        {d.doc_date && <span>Dated {d.doc_date}</span>}
                        {d.fiduciary && <span>Fiduciary: {d.fiduciary}</span>}
                        {d.location && <span>Location: {d.location}</span>}
                      </div>
                      {d.notes && <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>{d.notes}</div>}
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Beneficiaries */}
          {beneficiaries.length > 0 && (
            <Section title="Beneficiary designations">
              <ul className="rounded-md border divide-y" style={{ borderColor: "var(--line)" }}>
                {beneficiaries.map((b, i) => (
                  <li key={i} className="px-3 py-2 flex items-center justify-between gap-3 text-sm" style={{ borderColor: "var(--line)" }}>
                    <span className="min-w-0">
                      <span className="font-medium">{b.applies_to}</span>
                      <span className="text-xs ml-2" style={{ color: "var(--ink-soft)" }}>{b.designation}</span>
                    </span>
                    <span className="text-right">
                      {b.beneficiary}
                      {b.share_pct != null && b.share_pct !== "" && <span className="text-xs ml-1" style={{ color: "var(--ink-soft)" }}>({num(b.share_pct)}%)</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Household */}
          {household.length > 0 && (
            <Section title="Household">
              <ul className="rounded-md border divide-y" style={{ borderColor: "var(--line)" }}>
                {household.map((h, i) => (
                  <li key={i} className="px-3 py-2 flex items-center justify-between gap-3 text-sm" style={{ borderColor: "var(--line)" }}>
                    <span>
                      <span className="font-medium">{h.name}</span>
                      {h.relationship && <span className="text-xs ml-2" style={{ color: "var(--ink-soft)" }}>{h.relationship}</span>}
                      {h.is_dependent && <span className="pill pill-gray ml-2" style={{ fontSize: 10 }}>Dependent</span>}
                    </span>
                    <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
                      {h.date_of_birth}{age(h.date_of_birth) && ` · ${age(h.date_of_birth)}`}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Account details */}
          {accountsWithMeta.length > 0 && (
            <Section title="Account details">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>
                      <th className="text-left font-semibold py-1.5 pr-3">Account</th>
                      <th className="text-left font-semibold py-1.5 pr-3">Institution</th>
                      <th className="text-left font-semibold py-1.5 pr-3">Type</th>
                      <th className="text-left font-semibold py-1.5 pr-3">Owner</th>
                      <th className="text-left font-semibold py-1.5 pr-3">As of</th>
                      <th className="text-left font-semibold py-1.5">RMD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountsWithMeta.map((a, i) => (
                      <tr key={i} className="border-t" style={{ borderColor: "var(--line)" }}>
                        <td className="py-1.5 pr-3 font-medium">{a.label}</td>
                        <td className="py-1.5 pr-3">{a.institution || "—"}</td>
                        <td className="py-1.5 pr-3">{a.account_type || "—"}</td>
                        <td className="py-1.5 pr-3">{a.owner || "—"}</td>
                        <td className="py-1.5 pr-3">{a.as_of_date || "—"}</td>
                        <td className="py-1.5">{a.apply_rmd == null ? "—" : a.apply_rmd ? "Yes" : "No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}
        </div>
      </details>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--ink-soft)" }}>{title}</div>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--ink-soft)" }}>{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

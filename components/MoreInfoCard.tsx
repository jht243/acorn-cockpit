import { fmtUSD } from "../lib/data";

type Insurance = {
  policy_type?: string; name?: string; carrier?: string; insured?: string; owner?: string;
  coverage_amount?: number | string | null; annual_premium?: number | string | null;
  cash_value?: number | string | null; policy_number?: string; renewal_date?: string;
  beneficiary_summary?: string; notes?: string;
};
type Estate = { doc_type?: string; in_place?: boolean; doc_date?: string; location?: string; fiduciary?: string; notes?: string };
type Beneficiary = { applies_to?: string; applies_to_type?: string; designation?: string; beneficiary?: string; share_pct?: number | string | null; notes?: string };
type Household = {
  name?: string; relationship?: string; date_of_birth?: string; is_dependent?: boolean; notes?: string;
  retirement_age?: number | null; life_expectancy?: number | null; employer?: string; job_title?: string; work_email?: string;
};
type AssetRow = {
  label?: string; institution?: string; account_type?: string; owner?: string; as_of_date?: string; apply_rmd?: boolean;
  purchase_amount?: number | string | null; purchase_year?: number | null; tax_basis?: number | string | null;
  address?: string; inherited_year?: number | null; distribution_method?: string;
};
type LiabilityRow = {
  label?: string; balance?: number | string | null; rate?: number | string | null; institution?: string;
  monthly_payment?: number | string | null; term_months?: number | null; origination_date?: string;
  origination_amount?: number | string | null; linked_asset_label?: string; loan_type?: string;
};
type SocialSecurity = {
  person_name?: string; retirement_benefit?: number | string | null; disability_benefit?: number | string | null;
  survivor_benefit?: number | string | null; claim_age?: number | null; years_employed?: number | null;
  highest_salary?: number | string | null; notes?: string;
};
type Advisor = { role?: string; name?: string; firm?: string; email?: string; phone?: string; notes?: string };
type BusinessPartner = { business_name?: string; partner_name?: string; ownership_pct?: number | string | null; role?: string; notes?: string };
type EducationGoal = {
  beneficiary_name?: string; description?: string; institution?: string; annual_amount?: number | string | null;
  start_year?: number | null; end_year?: number | null; tuition?: number | string | null; room_board?: number | string | null;
  books_supplies?: number | string | null; other_expenses?: number | string | null; notes?: string;
};

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
  liabilities = [], socialSecurity = [], advisors = [], businessPartners = [], educationGoals = [],
}: {
  insurance?: Insurance[]; estate?: Estate[]; beneficiaries?: Beneficiary[]; household?: Household[]; assets?: AssetRow[];
  liabilities?: LiabilityRow[]; socialSecurity?: SocialSecurity[]; advisors?: Advisor[];
  businessPartners?: BusinessPartner[]; educationGoals?: EducationGoal[];
}) {
  const accountsWithMeta = assets.filter((a) => a.institution || a.account_type || a.owner || a.as_of_date || a.apply_rmd != null);
  const propertyDetail = assets.filter((a) => a.purchase_amount != null || a.purchase_year != null || a.tax_basis != null || a.address);
  const inheritedAccts = assets.filter((a) => a.inherited_year != null || a.distribution_method);
  const loanDetail = liabilities.filter((l) => l.institution || l.monthly_payment != null || l.term_months != null || l.origination_amount != null || l.loan_type);
  const count = insurance.length + estate.length + beneficiaries.length + household.length + accountsWithMeta.length
    + socialSecurity.length + advisors.length + businessPartners.length + educationGoals.length
    + propertyDetail.length + inheritedAccts.length + loanDetail.length;

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
                  <li key={i} className="px-3 py-2 flex items-start justify-between gap-3 text-sm" style={{ borderColor: "var(--line)" }}>
                    <span className="min-w-0">
                      <span className="font-medium">{h.name}</span>
                      {h.relationship && <span className="text-xs ml-2" style={{ color: "var(--ink-soft)" }}>{h.relationship}</span>}
                      {h.is_dependent && <span className="pill pill-gray ml-2" style={{ fontSize: 10 }}>Dependent</span>}
                      {(h.employer || h.job_title) && (
                        <div className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>
                          {[h.job_title, h.employer].filter(Boolean).join(" · ")}
                        </div>
                      )}
                      {h.notes && <div className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>{h.notes}</div>}
                    </span>
                    <span className="text-xs text-right shrink-0" style={{ color: "var(--ink-soft)" }}>
                      <div>{h.date_of_birth}{age(h.date_of_birth) && ` · ${age(h.date_of_birth)}`}</div>
                      {(h.retirement_age != null || h.life_expectancy != null) && (
                        <div>
                          {h.retirement_age != null ? `Retire ${h.retirement_age}` : ""}
                          {h.retirement_age != null && h.life_expectancy != null ? " · " : ""}
                          {h.life_expectancy != null ? `LE ${h.life_expectancy}` : ""}
                        </div>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Social Security projections */}
          {socialSecurity.length > 0 && (
            <Section title="Social Security projections">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>
                      <th className="text-left font-semibold py-1.5 pr-3">Person</th>
                      <th className="text-right font-semibold py-1.5 pr-3">Retirement</th>
                      <th className="text-right font-semibold py-1.5 pr-3">Disability</th>
                      <th className="text-right font-semibold py-1.5 pr-3">Survivor</th>
                      <th className="text-right font-semibold py-1.5">Claim age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {socialSecurity.map((s, i) => (
                      <tr key={i} className="border-t" style={{ borderColor: "var(--line)" }}>
                        <td className="py-1.5 pr-3 font-medium">{s.person_name}</td>
                        <td className="py-1.5 pr-3 text-right tabular-nums">{money(s.retirement_benefit)}</td>
                        <td className="py-1.5 pr-3 text-right tabular-nums">{money(s.disability_benefit)}</td>
                        <td className="py-1.5 pr-3 text-right tabular-nums">{money(s.survivor_benefit)}</td>
                        <td className="py-1.5 text-right tabular-nums">{s.claim_age ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {/* Client's existing advisors */}
          {advisors.length > 0 && (
            <Section title="Their advisors">
              <ul className="rounded-md border divide-y" style={{ borderColor: "var(--line)" }}>
                {advisors.map((a, i) => {
                  const missing = !a.name || a.name === "—";
                  return (
                    <li key={i} className="px-3 py-2.5 flex items-start justify-between gap-3" style={{ borderColor: "var(--line)" }}>
                      <div className="min-w-0">
                        <div className="text-sm font-medium flex items-center gap-2">
                          {a.role}
                          {missing && <span className="pill pill-amber" style={{ fontSize: 10 }}>Referral opportunity</span>}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>
                          {missing ? "None on file" : [a.name, a.firm].filter(Boolean).join(" · ")}
                          {a.notes ? ` — ${a.notes}` : ""}
                        </div>
                      </div>
                      {a.email && <a href={`mailto:${a.email}`} className="text-xs shrink-0" style={{ color: "var(--brand)" }}>email</a>}
                    </li>
                  );
                })}
              </ul>
            </Section>
          )}

          {/* Business partners */}
          {businessPartners.length > 0 && (
            <Section title="Business partners">
              <ul className="rounded-md border divide-y" style={{ borderColor: "var(--line)" }}>
                {businessPartners.map((b, i) => (
                  <li key={i} className="px-3 py-2 flex items-center justify-between gap-3 text-sm" style={{ borderColor: "var(--line)" }}>
                    <span className="min-w-0">
                      <span className="font-medium">{b.business_name}</span>
                      <span className="text-xs ml-2" style={{ color: "var(--ink-soft)" }}>{b.partner_name}{b.role ? ` · ${b.role}` : ""}</span>
                    </span>
                    <span className="tabular-nums shrink-0">{b.ownership_pct != null ? `${num(b.ownership_pct)}%` : "—"}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Education goals */}
          {educationGoals.length > 0 && (
            <Section title="Education funding">
              <div className="space-y-2">
                {educationGoals.map((g, i) => (
                  <div key={i} className="rounded-md border p-3" style={{ borderColor: "var(--line)" }}>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="text-sm font-medium">{g.beneficiary_name} — {g.description}</div>
                      <div className="text-sm font-semibold tabular-nums">{money(g.annual_amount)}<span className="text-xs font-normal" style={{ color: "var(--ink-soft)" }}>/yr</span></div>
                    </div>
                    <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 mt-2">
                      <Field label="Years" value={g.start_year && g.end_year ? `${g.start_year}–${g.end_year}` : undefined} />
                      <Field label="Institution" value={g.institution && g.institution !== "—" ? g.institution : undefined} />
                      <Field label="Tuition" value={num(g.tuition) > 0 ? money(g.tuition) : undefined} />
                      <Field label="Room & board" value={num(g.room_board) > 0 ? money(g.room_board) : undefined} />
                    </dl>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Loan / mortgage detail */}
          {loanDetail.length > 0 && (
            <Section title="Loan & mortgage detail">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>
                      <th className="text-left font-semibold py-1.5 pr-3">Loan</th>
                      <th className="text-left font-semibold py-1.5 pr-3">Type</th>
                      <th className="text-left font-semibold py-1.5 pr-3">Lender</th>
                      <th className="text-right font-semibold py-1.5 pr-3">Monthly</th>
                      <th className="text-right font-semibold py-1.5 pr-3">Term</th>
                      <th className="text-left font-semibold py-1.5">Secured by</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loanDetail.map((l, i) => (
                      <tr key={i} className="border-t" style={{ borderColor: "var(--line)" }}>
                        <td className="py-1.5 pr-3 font-medium">{l.label}</td>
                        <td className="py-1.5 pr-3">{l.loan_type || "—"}</td>
                        <td className="py-1.5 pr-3">{l.institution || "—"}</td>
                        <td className="py-1.5 pr-3 text-right tabular-nums">{l.monthly_payment != null ? money(l.monthly_payment) : "—"}</td>
                        <td className="py-1.5 pr-3 text-right tabular-nums">{l.term_months ? `${Math.round(l.term_months / 12)} yr` : "—"}</td>
                        <td className="py-1.5">{l.linked_asset_label || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {/* Property basis */}
          {propertyDetail.length > 0 && (
            <Section title="Property basis & addresses">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>
                      <th className="text-left font-semibold py-1.5 pr-3">Property</th>
                      <th className="text-right font-semibold py-1.5 pr-3">Purchased</th>
                      <th className="text-right font-semibold py-1.5 pr-3">Purchase price</th>
                      <th className="text-right font-semibold py-1.5 pr-3">Tax basis</th>
                      <th className="text-left font-semibold py-1.5">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyDetail.map((a, i) => (
                      <tr key={i} className="border-t" style={{ borderColor: "var(--line)" }}>
                        <td className="py-1.5 pr-3 font-medium">{a.label}</td>
                        <td className="py-1.5 pr-3 text-right tabular-nums">{a.purchase_year ?? "—"}</td>
                        <td className="py-1.5 pr-3 text-right tabular-nums">{a.purchase_amount != null ? money(a.purchase_amount) : "—"}</td>
                        <td className="py-1.5 pr-3 text-right tabular-nums">{a.tax_basis != null ? money(a.tax_basis) : "—"}</td>
                        <td className="py-1.5">{a.address || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {/* Inherited accounts */}
          {inheritedAccts.length > 0 && (
            <Section title="Inherited accounts">
              <ul className="rounded-md border divide-y" style={{ borderColor: "var(--line)" }}>
                {inheritedAccts.map((a, i) => (
                  <li key={i} className="px-3 py-2 flex items-center justify-between gap-3 text-sm" style={{ borderColor: "var(--line)" }}>
                    <span className="font-medium min-w-0 truncate">{a.label}</span>
                    <span className="text-xs shrink-0" style={{ color: "var(--ink-soft)" }}>
                      {a.inherited_year ? `Inherited ${a.inherited_year}` : ""}{a.distribution_method ? ` · ${a.distribution_method}` : ""}
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

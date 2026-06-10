"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Asset = { label: string; value: string; category: string };
type Liability = { label: string; balance: string; rate: string };
type ProfTeamEntry = { name: string; firm: string; email: string; contactPermission: string; dontHave: boolean; role?: string };
type ProfTeam = {
  cpa: ProfTeamEntry;
  estateAttorney: ProfTeamEntry;
  financialAdvisor: ProfTeamEntry;
  insuranceAgent: ProfTeamEntry;
  banker: ProfTeamEntry;
  businessAttorney: ProfTeamEntry;
  other: ProfTeamEntry;
};

const BLANK_ENTRY: ProfTeamEntry = { name: '', firm: '', email: '', contactPermission: '', dontHave: false };
const BLANK_TEAM: ProfTeam = {
  cpa: { ...BLANK_ENTRY },
  estateAttorney: { ...BLANK_ENTRY },
  financialAdvisor: { ...BLANK_ENTRY },
  insuranceAgent: { ...BLANK_ENTRY },
  banker: { ...BLANK_ENTRY },
  businessAttorney: { ...BLANK_ENTRY },
  other: { ...BLANK_ENTRY, role: '' },
};

const WHAT_BRINGS_OPTIONS = [
  "A life event (marriage, divorce, new baby, death in family)",
  "I'm trying to buy a home",
  "Business planning or ownership",
  "Retirement planning",
  "Estate planning or protecting my family",
  "I don't have a financial plan and want one",
  "A friend or advisor referred me",
  "Something else",
];

const GOAL_OPTIONS = [
  "Build a retirement income plan",
  "Reduce my tax burden",
  "Pay off debt faster",
  "Save for my children's education",
  "Protect my family with the right insurance",
  "Create or update my estate plan (will, trust, POA)",
  "Grow and invest my savings",
  "Buy a home or investment property",
  "Plan for a business exit or succession",
  "Set up or restructure a business entity",
  "Organize my finances so I know where I stand",
];

const URGENCY_OPTIONS = [
  { val: "urgent", label: "Urgent — need help now" },
  { val: "year", label: "In the next year" },
  { val: "ahead", label: "Looking ahead (2–5 years)" },
  { val: "exploring", label: "Just exploring for now" },
];

const DEPENDENT_OPTIONS = [
  "Children",
  "Pets",
  "Spouse / partner",
  "Aging parent(s)",
  "A sick or ill family member",
  "A special-needs child or sibling",
  "Grandchildren",
  "Another relative I support",
];

const INVOLVEMENT_OPTIONS = [
  "We make decisions together",
  "I handle everything",
  "My spouse / partner handles everything",
  "We split responsibilities",
];

const ASSET_TYPE_OPTIONS = [
  "Checking / Savings",
  "Brokerage (taxable investing)",
  "IRA / 401k / 403b",
  "Roth IRA",
  "Real Estate",
  "Business / LLC ownership",
  "Crypto",
  "Other",
];

const LIABILITY_TYPE_OPTIONS = [
  "Home mortgage",
  "HELOC",
  "Car loan(s)",
  "Student loans",
  "Business loans",
  "Credit card debt",
  "Other",
];

const PRO_TEAM_ROLES: { key: keyof ProfTeam; label: string; desc: string }[] = [
  { key: "cpa", label: "CPA / Tax Professional", desc: "Prepares your tax returns or advises on tax strategy" },
  { key: "estateAttorney", label: "Estate Attorney", desc: "Drafted your will, trust, or other estate documents" },
  { key: "financialAdvisor", label: "Financial Advisor", desc: "Manages investments or provides financial guidance" },
  { key: "insuranceAgent", label: "Insurance Agent", desc: "Handles your life, disability, or other insurance" },
  { key: "banker", label: "Banker / Lender", desc: "Relationship banker, mortgage lender, or credit officer" },
  { key: "businessAttorney", label: "Business Attorney", desc: "Advises on contracts, entity structure, or business law" },
  { key: "other", label: "Other Professional", desc: "Any other advisor we should know about" },
];

const STEPS = [
  "Welcome", "What brings you", "About you", "Goals", "Dependents",
  "Your team", "Assets", "Liabilities", "Income & finances",
  "Estate & insurance", "Documents", "Review",
];

export default function Intake() {
  const [step, setStep] = useState(0);
  const [token, setToken] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [adminReturnUrl, setAdminReturnUrl] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [showSaved, setShowSaved] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);

  const [data, setData] = useState({
    completingAs: "",
    completingAsOther: "",
    relationshipToClient: "",
    contactWho: "",
    whatBringsYou: "",
    whatBringsYouOptions: [] as string[],
    clientName: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    spouseName: "",
    spouseDob: "",
    goalsSelected: [] as string[],
    goals: "",
    goalUrgency: "",
    largestObstacle: "",
    dependentsSelected: [] as string[],
    children: "",
    planningInvolvement: [] as string[],
    professionalTeam: { ...BLANK_TEAM } as ProfTeam,
    assetTypes: [] as string[],
    assets: [{ label: "", value: "", category: "Cash" }] as Asset[],
    liabilityTypes: [] as string[],
    liabilities: [{ label: "", balance: "", rate: "" }] as Liability[],
    noLiabilities: false,
    annualIncome: "",
    monthlyExpenses: "",
    financialPictureMethod: "",
    financialClarity: "",
    risk: "",
    hasWill: "",
    hasTrust: "",
    hasPOA: "",
    hasHealthcareDirective: "",
    hasBeneficiaryDesignations: "",
    hasLifeIns: "",
    hasLTCIns: "",
    hasDisabilityIns: "",
    hasPropertyIns: "",
    estatePlanNotes: "",
    docUploadPreference: "",
    docAcknowledged: false,
    documentStatuses: {} as Record<string, string>,
    helpRequested: false,
    helpRequestSection: "",
    reviewWithAcornSections: [] as string[],
    termsAgreed: false,
  });

  const update = (k: string, v: any) => setData((d) => ({ ...d, [k]: v }));

  const toggle = (
    k: "goalsSelected" | "dependentsSelected" | "whatBringsYouOptions" | "assetTypes" | "liabilityTypes" | "planningInvolvement",
    v: string
  ) =>
    setData((d) => ({
      ...d,
      [k]: (d[k] as string[]).includes(v)
        ? (d[k] as string[]).filter((x) => x !== v)
        : [...(d[k] as string[]), v],
    }));

  const updateTeam = (role: keyof ProfTeam, field: string, value: any) =>
    setData((d) => ({
      ...d,
      professionalTeam: {
        ...d.professionalTeam,
        [role]: { ...d.professionalTeam[role], [field]: value },
      },
    }));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (params.get("from") === "admin" && params.get("clientId")) {
      setAdminReturnUrl(`/dashboard/clients/${params.get("clientId")}`);
    }
    if (!t) { setHydrated(true); return; }
    setToken(t);
    import("./actions").then(async ({ markIntakeStarted, getIntakeFormData }) => {
      markIntakeStarted(t);
      const existing = await getIntakeFormData(t);
      if (existing?.intake_form_data) {
        setData((d) => ({ ...d, ...existing.intake_form_data }));
      } else if (existing?.name || existing?.email) {
        setData((d) => ({ ...d, clientName: d.clientName || existing.name || "", email: d.email || existing.email || "" }));
      }
      setHydrated(true);
    });
  }, []);

  const goToStep = async (next: number, currentData = data) => {
    setStepError(null);
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (token && hydrated) {
      setSaveStatus("saving");
      try {
        const { saveIntakeProgress } = await import("./actions");
        await saveIntakeProgress(token, currentData);
        setSaveStatus("saved");
        setShowSaved(true);
        setTimeout(() => { setSaveStatus("idle"); setShowSaved(false); }, 2500);
      } catch {
        setSaveStatus("idle");
      }
    }
  };

  const currentStepLabel = STEPS[step] || "";

  return (
    <div className="min-h-screen flex flex-col pb-28" style={{ background: "var(--bg)" }}>
      <header className="bg-white border-b py-4 px-6 flex items-center justify-between" style={{ borderColor: "var(--line)" }}>
        <div className="flex items-center gap-2">
          <Logo />
          <div>
            <div className="text-sm font-semibold">Acorn Care</div>
            <div className="text-xs" style={{ color: "var(--ink-soft)" }}>Concierge Financial Planning</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {adminReturnUrl && (
            <Link href={adminReturnUrl} className="text-sm font-medium px-3 py-1.5 rounded-md border hover:bg-[var(--brand-soft)] transition-colors" style={{ borderColor: "var(--line)", color: "var(--brand-dark)" }}>
              ← Back to client profile
            </Link>
          )}
          <div className="text-xs flex items-center gap-1" style={{ color: saveStatus === "saved" ? "#16a34a" : "var(--ink-soft)" }}>
            {saveStatus === "saving" && "Saving…"}
            {saveStatus === "saved" && (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5L20 6"/></svg>
                Saved
              </>
            )}
            {saveStatus === "idle" && "Secure · saves as you go"}
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-3xl w-full mx-auto p-6">
        {step > 0 && (
          <div className="flex items-center gap-1 mb-3">
            {STEPS.slice(1).map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-[var(--brand)]" : "bg-[var(--line)]"}`} />
            ))}
          </div>
        )}
        {showSaved && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md mb-4 text-sm" style={{ background: "#f0faf4", color: "#166534" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5L20 6"/></svg>
            Progress saved
          </div>
        )}

        <div className="card">
          <div className="card-pad">

            {/* Step 0 — Welcome */}
            {step === 0 && <Welcome onNext={() => goToStep(1)} />}

            {/* Step 1 — What brings you */}
            {step === 1 && (
              <Section title="Welcome — let's get started" subtitle="Tell us a bit about why you're here and who's filling this out.">
                <Field label="What brings you to Acorn Care? Select all that apply." full>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {WHAT_BRINGS_OPTIONS.map((o) => {
                      const active = data.whatBringsYouOptions.includes(o);
                      return (
                        <button key={o} type="button" onClick={() => toggle("whatBringsYouOptions", o)}
                          className={`py-2 px-3 rounded-md border text-sm ${active ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] font-medium" : "border-[var(--line)] bg-white"}`}>
                          {o}
                        </button>
                      );
                    })}
                  </div>
                </Field>
                <div className="mt-4">
                  <Field label="Anything else you'd like to share? (optional)" full>
                    <textarea className="textarea" rows={2} value={data.whatBringsYou} onChange={(e) => update("whatBringsYou", e.target.value)} placeholder="In your own words…" />
                  </Field>
                </div>
                <div className="border-t my-5" style={{ borderColor: "var(--line)" }} />
                <Field label="Who is completing this form?" full>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {["The client (myself)", "Spouse / partner", "Adult child on parent's behalf", "Advisor on client's behalf", "Someone else"].map((o) => (
                      <button key={o} type="button" onClick={() => update("completingAs", o)}
                        className={`py-2 px-3 rounded-md border text-sm ${data.completingAs === o ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] font-medium" : "border-[var(--line)] bg-white"}`}>
                        {o}
                      </button>
                    ))}
                  </div>
                </Field>
                {(data.completingAs === "Someone else" || data.completingAs === "Advisor on client's behalf" || data.completingAs === "Adult child on parent's behalf") && (
                  <div className="mt-3">
                    <Grid>
                      <Field label="Your relationship to the client">
                        <input className="input" value={data.relationshipToClient} onChange={(e) => update("relationshipToClient", e.target.value)} placeholder="e.g., Son, daughter, financial advisor" />
                      </Field>
                      <Field label="Best person for Karli to contact">
                        <input className="input" value={data.contactWho} onChange={(e) => update("contactWho", e.target.value)} placeholder="e.g., The client directly" />
                      </Field>
                    </Grid>
                  </div>
                )}
              </Section>
            )}

            {/* Step 2 — About you */}
            {step === 2 && (
              <Section title="About you" subtitle="The basics — kept completely confidential.">
                <Grid>
                  <Field label="Full name *"><input className={`input ${stepError && !data.clientName.trim() ? "border-red-400" : ""}`} value={data.clientName} onChange={(e) => update("clientName", e.target.value)} placeholder="Jane Doe" /></Field>
                  <Field label="Date of birth"><input type="date" className="input" value={data.dob} onChange={(e) => update("dob", e.target.value)} /></Field>
                  <Field label="Email *"><input className={`input ${stepError && !data.email.trim() ? "border-red-400" : ""}`} value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="jane@example.com" /></Field>
                  <Field label="Phone"><input className="input" value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="305-555-1234" /></Field>
                  <Field label="Mailing address" full><input className="input" value={data.address} onChange={(e) => update("address", e.target.value)} placeholder="Street, City, State, ZIP" /></Field>
                  <Field label="Spouse / partner name (optional)"><input className="input" value={data.spouseName} onChange={(e) => update("spouseName", e.target.value)} /></Field>
                  <Field label="Spouse / partner DOB (optional)"><input type="date" className="input" value={data.spouseDob} onChange={(e) => update("spouseDob", e.target.value)} /></Field>
                </Grid>
              </Section>
            )}

            {/* Step 3 — Goals */}
            {step === 3 && (
              <Section title="Your goals" subtitle="What specific outcomes do you want from a financial plan? Select all that apply.">
                <div className="grid grid-cols-1 gap-2">
                  {GOAL_OPTIONS.map((g) => {
                    const active = data.goalsSelected.includes(g);
                    return (
                      <button key={g} type="button" onClick={() => toggle("goalsSelected", g)}
                        className={`flex items-center gap-3 text-left py-2.5 px-3 rounded-md border text-sm ${active ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] font-medium" : "border-[var(--line)] bg-white"}`}>
                        <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${active ? "border-[var(--brand)] bg-[var(--brand)] text-white" : "border-[var(--line)] bg-white"}`}>
                          {active && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 6"/></svg>}
                        </span>
                        {g}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-5">
                  <Field label="Anything else you'd like to accomplish? (optional)" full>
                    <textarea className="textarea" rows={3} value={data.goals} onChange={(e) => update("goals", e.target.value)} placeholder="e.g., Retire by 60, sell my business in 5 years, set up a 529…" />
                  </Field>
                </div>
                <div className="mt-4">
                  <Field label="How urgent are your goals?" full>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {URGENCY_OPTIONS.map(({ val, label }) => (
                        <button key={val} type="button" onClick={() => update("goalUrgency", val)}
                          className={`py-2 px-3 rounded-md border text-sm ${data.goalUrgency === val ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] font-medium" : "border-[var(--line)] bg-white"}`}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
                <div className="mt-4">
                  <Field label="What's the biggest obstacle standing between you and your goals? (optional)" full>
                    <textarea className="textarea" rows={2} value={data.largestObstacle} onChange={(e) => update("largestObstacle", e.target.value)} />
                  </Field>
                </div>
              </Section>
            )}

            {/* Step 4 — Dependents */}
            {step === 4 && (
              <Section title="Family & dependents" subtitle="Who do we need to plan around — now and in the years ahead?">
                <div className="card card-pad mb-4 text-sm" style={{ background: "#f9fbfa", color: "var(--ink-soft)" }}>
                  Think beyond immediate family — aging parents, a special-needs sibling, anyone you expect to support down the road.
                </div>
                <Field label="Who depends on you? (select all that apply)" full>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {DEPENDENT_OPTIONS.map((g) => {
                      const active = data.dependentsSelected.includes(g);
                      return (
                        <button key={g} type="button" onClick={() => toggle("dependentsSelected", g)}
                          className={`py-2 px-3 rounded-md border text-sm ${active ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] font-medium" : "border-[var(--line)] bg-white"}`}>
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </Field>
                <div className="mt-4">
                  <Field label="Tell us a bit more — names, ages, support needs (optional)" full>
                    <textarea className="textarea" rows={4} value={data.children} onChange={(e) => update("children", e.target.value)}
                      placeholder="e.g., Maya (12), Liam (9); my mother (78) will likely need care in a few years…" />
                  </Field>
                </div>
                <div className="mt-4">
                  <Field label="How do you and your spouse / partner handle financial decisions? (optional)" full>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {INVOLVEMENT_OPTIONS.map((o) => {
                        const active = data.planningInvolvement.includes(o);
                        return (
                          <button key={o} type="button" onClick={() => toggle("planningInvolvement", o)}
                            className={`py-2 px-3 rounded-md border text-sm ${active ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] font-medium" : "border-[var(--line)] bg-white"}`}>
                            {o}
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                </div>
              </Section>
            )}

            {/* Step 5 — Professional team */}
            {step === 5 && (
              <Section title="Your professional team" subtitle="Who else is in your corner? This helps us coordinate — with your permission — to give you better advice.">
                <div className="space-y-4">
                  {PRO_TEAM_ROLES.map(({ key, label, desc }) => {
                    const entry = data.professionalTeam[key];
                    return (
                      <div key={key} className="card card-pad" style={{ background: entry.dontHave ? "#f9fbfa" : "white" }}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <div className="text-sm font-semibold">{label}</div>
                            <div className="text-xs" style={{ color: "var(--ink-soft)" }}>{desc}</div>
                          </div>
                          <button type="button" onClick={() => updateTeam(key, "dontHave", !entry.dontHave)}
                            className={`shrink-0 text-xs px-2.5 py-1 rounded border ${entry.dontHave ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] font-medium" : "border-[var(--line)]"}`}>
                            I don't have one
                          </button>
                        </div>
                        {!entry.dontHave && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                            {key === "other" && (
                              <div className="md:col-span-2">
                                <label className="label">Their role / title</label>
                                <input className="input" value={(entry as any).role || ""} onChange={(e) => updateTeam(key, "role", e.target.value)} placeholder="e.g., Financial coach" />
                              </div>
                            )}
                            <div>
                              <label className="label">Name</label>
                              <input className="input" value={entry.name} onChange={(e) => updateTeam(key, "name", e.target.value)} placeholder="Full name" />
                            </div>
                            <div>
                              <label className="label">Firm (optional)</label>
                              <input className="input" value={entry.firm} onChange={(e) => updateTeam(key, "firm", e.target.value)} placeholder="Firm name" />
                            </div>
                            <div>
                              <label className="label">Email (optional)</label>
                              <input className="input" value={entry.email} onChange={(e) => updateTeam(key, "email", e.target.value)} placeholder="advisor@firm.com" />
                            </div>
                            <div>
                              <label className="label">May Acorn Care contact them?</label>
                              <div className="flex gap-2">
                                {["Yes", "No", "Ask me first"].map((v) => (
                                  <button key={v} type="button" onClick={() => updateTeam(key, "contactPermission", v)}
                                    className={`flex-1 py-1.5 rounded border text-xs ${entry.contactPermission === v ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] font-medium" : "border-[var(--line)] bg-white"}`}>
                                    {v}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Section>
            )}

            {/* Step 6 — Assets */}
            {step === 6 && (
              <Section title="Assets" subtitle="What types of assets do you have? Select all that apply — then add details below.">
                <Field label="Asset types" full>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {ASSET_TYPE_OPTIONS.map((t) => {
                      const active = data.assetTypes.includes(t);
                      return (
                        <button key={t} type="button" onClick={() => toggle("assetTypes", t)}
                          className={`py-2 px-3 rounded-md border text-sm ${active ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] font-medium" : "border-[var(--line)] bg-white"}`}>
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </Field>
                <div className="border-t my-5" style={{ borderColor: "var(--line)" }} />
                <div className="text-sm font-medium mb-3">Add your assets <span className="font-normal" style={{ color: "var(--ink-soft)" }}>(estimates are fine)</span></div>
                <ItemList
                  items={data.assets}
                  onChange={(items) => update("assets", items)}
                  renderRow={(item, set) => (
                    <>
                      <input className="input flex-[2]" placeholder="e.g., Fidelity Brokerage, Primary Home" value={item.label} onChange={(e) => set({ ...item, label: e.target.value })} />
                      <input className="input flex-1" placeholder="$ value" value={item.value} onChange={(e) => set({ ...item, value: e.target.value })} />
                      <select className="select flex-1" value={item.category} onChange={(e) => set({ ...item, category: e.target.value })}>
                        {["Cash", "Taxable", "Qualified", "Roth", "Real Estate", "Business"].map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </>
                  )}
                  blank={{ label: "", value: "", category: "Cash" }}
                  addLabel="+ Add asset"
                />
              </Section>
            )}

            {/* Step 7 — Liabilities */}
            {step === 7 && (
              <Section title="Liabilities" subtitle="Any loans, mortgages, or debt. Estimates are fine.">
                <div className="mb-4">
                  <button type="button" onClick={() => update("noLiabilities", !data.noLiabilities)}
                    className={`py-2 px-3 rounded-md border text-sm ${data.noLiabilities ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] font-medium" : "border-[var(--line)] bg-white"}`}>
                    I have no liabilities / debt
                  </button>
                </div>
                {!data.noLiabilities && (
                  <>
                    <Field label="Liability types — select all that apply" full>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {LIABILITY_TYPE_OPTIONS.map((t) => {
                          const active = data.liabilityTypes.includes(t);
                          return (
                            <button key={t} type="button" onClick={() => toggle("liabilityTypes", t)}
                              className={`py-2 px-3 rounded-md border text-sm ${active ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] font-medium" : "border-[var(--line)] bg-white"}`}>
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </Field>
                    <div className="border-t my-5" style={{ borderColor: "var(--line)" }} />
                    <div className="text-sm font-medium mb-3">Add your liabilities</div>
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
                  </>
                )}
              </Section>
            )}

            {/* Step 8 — Income & finances */}
            {step === 8 && (
              <Section title="Income & finances" subtitle="Rough numbers work great — we'll refine everything together.">
                <Grid>
                  <Field label="Total annual income (all sources)"><input className="input" placeholder="$ / year" value={data.annualIncome} onChange={(e) => update("annualIncome", e.target.value)} /></Field>
                  <Field label="Total monthly expenses (all-in estimate)"><input className="input" placeholder="$ / month" value={data.monthlyExpenses} onChange={(e) => update("monthlyExpenses", e.target.value)} /></Field>
                </Grid>
                <div className="border-t my-5" style={{ borderColor: "var(--line)" }} />
                <Field label="How would you prefer to share your complete financial picture?" full>
                  <div className="space-y-2 mt-1">
                    {[
                      { val: "plaid", label: "Connect via Plaid", sub: "Fastest — securely link your bank & investment accounts (read-only, never stores credentials)" },
                      { val: "manual", label: "Enter manually", sub: "I'll type in my accounts and numbers myself" },
                      { val: "docs", label: "Share documents later", sub: "I'll send statements or tax returns to Karli after this form" },
                    ].map(({ val, label, sub }) => (
                      <button key={val} type="button" onClick={() => update("financialPictureMethod", val)}
                        className={`w-full text-left px-3 py-2.5 rounded-md border text-sm ${data.financialPictureMethod === val ? "border-[var(--brand)] bg-[var(--brand-soft)]" : "border-[var(--line)] bg-white"}`}>
                        <div className={`font-medium ${data.financialPictureMethod === val ? "text-[var(--brand-dark)]" : ""}`}>{label}</div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>{sub}</div>
                      </button>
                    ))}
                  </div>
                </Field>
                <div className="border-t my-5" style={{ borderColor: "var(--line)" }} />
                <Field label="How clear is your current financial picture?" full>
                  <div className="flex flex-col gap-2 mt-1">
                    {[
                      { val: "1", label: "Very unclear — I don't know where to start" },
                      { val: "2", label: "Somewhat unclear" },
                      { val: "3", label: "Somewhat clear" },
                      { val: "4", label: "Mostly clear" },
                      { val: "5", label: "Very clear — I track everything" },
                    ].map(({ val, label }) => (
                      <button key={val} type="button" onClick={() => update("financialClarity", val)}
                        className={`text-left py-2 px-3 rounded-md border text-sm ${data.financialClarity === val ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] font-medium" : "border-[var(--line)] bg-white"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </Field>
                <div className="border-t my-5" style={{ borderColor: "var(--line)" }} />
                <Field label="Financial risk tolerance" full>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {["Conservative", "Moderate", "Aggressive", "I'm not sure"].map((r) => (
                      <button key={r} type="button" onClick={() => update("risk", r)}
                        className={`flex-1 py-2 px-3 rounded-md border text-sm ${data.risk === r ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] font-medium" : "border-[var(--line)] bg-white"}`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </Field>
              </Section>
            )}

            {/* Step 9 — Estate & insurance */}
            {step === 9 && (
              <Section title="Estate & insurance" subtitle="What's already in place? Don't worry if you're not sure — that's what we're here for.">
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--brand)" }}>Estate planning documents</div>
                <Grid>
                  <YN label="Will" value={data.hasWill} onChange={(v) => update("hasWill", v)} />
                  <YN label="Trust" value={data.hasTrust} onChange={(v) => update("hasTrust", v)} />
                  <YN label="Power of attorney (POA)" value={data.hasPOA} onChange={(v) => update("hasPOA", v)} />
                  <YN label="Healthcare directive / living will" value={data.hasHealthcareDirective} onChange={(v) => update("hasHealthcareDirective", v)} />
                  <YN label="Beneficiary designations up to date" value={data.hasBeneficiaryDesignations} onChange={(v) => update("hasBeneficiaryDesignations", v)} />
                </Grid>
                <div className="border-t my-5" style={{ borderColor: "var(--line)" }} />
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--brand)" }}>Insurance coverage</div>
                <Grid>
                  <YN label="Life insurance" value={data.hasLifeIns} onChange={(v) => update("hasLifeIns", v)} />
                  <YN label="Long-term care (LTC) insurance" value={data.hasLTCIns} onChange={(v) => update("hasLTCIns", v)} />
                  <YN label="Disability insurance" value={data.hasDisabilityIns} onChange={(v) => update("hasDisabilityIns", v)} />
                  <YN label="Property / casualty / umbrella" value={data.hasPropertyIns} onChange={(v) => update("hasPropertyIns", v)} />
                </Grid>
                <div className="mt-5">
                  <Field label="Anything else we should know about your estate plan or coverage? (optional)" full>
                    <textarea className="textarea" rows={3} value={data.estatePlanNotes} onChange={(e) => update("estatePlanNotes", e.target.value)} />
                  </Field>
                </div>
              </Section>
            )}

            {/* Step 10 — Documents */}
            {step === 10 && (
              <Section title="Documents" subtitle="Upload what you have — nothing needs to be perfect right now.">
                <div className="flex flex-wrap gap-2 mb-4">
                  {["I'll upload documents now", "Karli's team will request what we need"].map((o) => (
                    <button key={o} type="button" onClick={() => update("docUploadPreference", o)}
                      className={`py-2 px-3 rounded-md border text-sm ${data.docUploadPreference === o ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] font-medium" : "border-[var(--line)] bg-white"}`}>
                      {o}
                    </button>
                  ))}
                </div>
                {data.docUploadPreference === "I'll upload documents now" && (
                  <>
                    <Drop />
                    <div className="mt-3 px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-2" style={{ borderColor: "#f5c2c7", background: "#fff5f5", color: "#842029" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      Please do not upload medical records.
                    </div>
                    <div className="mt-4 space-y-4 text-sm">
                      {[
                        { cat: "Tax", items: ["Most recent tax return (Form 1040)", "K-1s, 1099s, W-2s"] },
                        { cat: "Statements", items: ["Investment & brokerage statements", "Retirement account statements"] },
                        { cat: "Estate", items: ["Will / trust documents", "Power of attorney"] },
                        { cat: "Insurance", items: ["Life insurance declarations", "Long-term care policy"] },
                        { cat: "Lending", items: ["Mortgage / loan statements"] },
                        { cat: "Income", items: ["Most recent pay stub", "Business P&L (if applicable)"] },
                      ].map(({ cat, items }) => (
                        <div key={cat}>
                          <div className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--brand)" }}>{cat}</div>
                          <ul className="space-y-1 pl-1">
                            {items.map((s) => (
                              <li key={s} className="flex items-center gap-2" style={{ color: "var(--ink-soft)" }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {data.docUploadPreference === "Karli's team will request what we need" && (
                  <div className="card card-pad" style={{ background: "#f9fbfa" }}>
                    <div className="text-sm" style={{ color: "var(--ink-soft)" }}>
                      No problem — Karli will follow up after your intake with a specific list based on your situation.
                    </div>
                  </div>
                )}
                <div className="mt-5">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-0.5" checked={data.docAcknowledged} onChange={(e) => update("docAcknowledged", e.target.checked)} />
                    <span className="text-sm" style={{ color: "var(--ink-soft)" }}>
                      I understand documents can be shared after this form — nothing will be missing from my intake.
                    </span>
                  </label>
                </div>
              </Section>
            )}

            {/* Step 11 — Review & submit */}
            {step === 11 && (
              <Section title="Review & submit" subtitle="Take a look — then submit when you're ready. Karli will review within 1 business day.">
                <ReviewBlock label="Name" value={data.clientName || "—"} />
                <ReviewBlock label="Email" value={data.email || "—"} />
                <ReviewBlock label="Phone" value={data.phone || "—"} />
                {data.spouseName && <ReviewBlock label="Spouse" value={data.spouseName} />}
                <ReviewBlock label="What brings you" value={[...data.whatBringsYouOptions, data.whatBringsYou].filter(Boolean).join("; ") || "—"} multiline />
                <ReviewBlock label="Goals" value={[...data.goalsSelected, data.goals].filter(Boolean).join("; ") || "—"} multiline />
                <ReviewBlock label="Goal urgency" value={URGENCY_OPTIONS.find((o) => o.val === data.goalUrgency)?.label || "—"} />
                <ReviewBlock label="Assets" value={[data.assetTypes.join(", "), data.assets.filter((a) => a.label).length ? `${data.assets.filter((a) => a.label).length} manual entries` : ""].filter(Boolean).join(" · ") || "—"} multiline />
                <ReviewBlock label="Liabilities" value={data.noLiabilities ? "None" : data.liabilities.filter((l) => l.label).length ? `${data.liabilities.filter((l) => l.label).length} entries` : "—"} />
                <ReviewBlock label="Annual income" value={data.annualIncome ? `$${data.annualIncome}` : "—"} />
                <ReviewBlock label="Risk tolerance" value={data.risk || "—"} />
                {data.reviewWithAcornSections.length > 0 && (
                  <ReviewBlock label="Review with Acorn" value={data.reviewWithAcornSections.join(", ")} />
                )}
                {data.helpRequested && (
                  <ReviewBlock label="Help call requested" value={`Yes — ${data.helpRequestSection || "unspecified section"}`} />
                )}
                <div className="mt-5">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-0.5" checked={data.termsAgreed} onChange={(e) => update("termsAgreed", e.target.checked)} />
                    <span className="text-sm" style={{ color: "var(--ink-soft)" }}>
                      I agree that Acorn Care, LLC may use this information to prepare a financial plan proposal.
                      Acorn Care is not affiliated with any banking institution and this is not investment advice.
                      My information is encrypted and never shared without my consent.
                    </span>
                  </label>
                </div>
              </Section>
            )}
          </div>

          {step > 0 && (
            <div className="card-pad border-t flex items-center justify-between" style={{ borderColor: "var(--line)" }}>
              <button className="btn-ghost btn" onClick={() => goToStep(Math.max(0, step - 1))}>← Back</button>
              <div className="flex items-center gap-3">
                {stepError && <span className="text-xs text-red-600">{stepError}</span>}
                <span className="text-xs" style={{ color: "var(--ink-soft)" }}>Step {step} of {STEPS.length - 1}</span>
                {step < STEPS.length - 1 ? (
                  <button className="btn" onClick={() => {
                    if (step === 2) {
                      if (!data.clientName.trim() || !data.email.trim()) {
                        setStepError("Name and email are required.");
                        return;
                      }
                    }
                    goToStep(step + 1);
                  }}>Continue →</button>
                ) : (
                  <button
                    className="btn"
                    disabled={!data.termsAgreed}
                    style={!data.termsAgreed ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                    onClick={async () => {
                      const { submitIntake } = await import("./actions");
                      const res = await submitIntake({ ...data, token });
                      if (res.success) {
                        window.location.href = "/intake/thanks";
                      } else {
                        alert("There was an error submitting your intake. Please try again.");
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

        {step > 0 && (
          <div className="mt-4 text-center text-xs flex items-center justify-center gap-4" style={{ color: "var(--ink-soft)" }}>
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <span>·</span>
            <a href="/terms" className="hover:underline">Terms of Service</a>
            <span>·</span>
            <a href="mailto:karli@acorncare.com" className="hover:underline">Contact Karli</a>
          </div>
        )}
      </div>

      {/* Floating help bar */}
      {step > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-3 px-5 py-3 rounded-full shadow-lg border text-sm bg-white" style={{ borderColor: "var(--line)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span style={{ color: "var(--ink-soft)" }}>Not sure about this section?</span>
            <span className="w-px h-4 inline-block" style={{ background: "var(--line)" }} />
            <button type="button"
              className="font-medium"
              style={{ color: data.reviewWithAcornSections.includes(currentStepLabel) ? "var(--ink-soft)" : "var(--brand)" }}
              onClick={async () => {
                if (!data.reviewWithAcornSections.includes(currentStepLabel)) {
                  update("reviewWithAcornSections", [...data.reviewWithAcornSections, currentStepLabel]);
                  if (token) {
                    const { saveReviewFlag } = await import("./actions");
                    await saveReviewFlag(token, currentStepLabel);
                  }
                }
              }}>
              {data.reviewWithAcornSections.includes(currentStepLabel) ? "✓ Flagged for review" : "Review with Acorn"}
            </button>
            <span style={{ color: "var(--line)" }}>·</span>
            <button type="button"
              className="font-medium"
              style={{ color: data.helpRequested ? "var(--ink-soft)" : "var(--brand)" }}
              onClick={async () => {
                if (!data.helpRequested) {
                  update("helpRequested", true);
                  update("helpRequestSection", currentStepLabel);
                  if (token) {
                    const { saveHelpRequest } = await import("./actions");
                    await saveHelpRequest(token, currentStepLabel);
                  }
                }
              }}>
              {data.helpRequested ? "✓ Help call requested" : "Book help call"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center py-6">
      <div className="flex justify-center mb-3"><Logo size={40} /></div>
      <h2 className="text-2xl font-semibold tracking-tight mb-2">Welcome to Acorn Care.</h2>
      <p className="text-sm max-w-md mx-auto mb-1" style={{ color: "var(--ink-soft)" }}>
        This intake takes about 15–20 minutes. Your progress saves automatically — come back any time.
      </p>
      <p className="text-sm max-w-md mx-auto mb-6" style={{ color: "var(--ink-soft)" }}>
        Estimates are fine. We'll refine everything together in your plan review.
      </p>
      <button className="btn" onClick={onNext}>Begin →</button>
      <div className="mt-8 grid grid-cols-3 gap-3 max-w-lg mx-auto text-xs" style={{ color: "var(--ink-soft)" }}>
        <div className="card card-pad"><div className="font-semibold text-[var(--ink)] mb-1">11 steps</div>Goals, team, assets, estate, documents.</div>
        <div className="card card-pad"><div className="font-semibold text-[var(--ink)] mb-1">Encrypted</div>Your data is encrypted at rest and in transit.</div>
        <div className="card card-pad"><div className="font-semibold text-[var(--ink)] mb-1">Save & resume</div>Pause any time — your link picks up where you left off.</div>
      </div>
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
      <div className="flex gap-2 flex-wrap">
        {[{ val: "yes", display: "Yes" }, { val: "no", display: "No" }, { val: "not sure", display: "Not sure" }].map(({ val, display }) => (
          <button key={val} type="button" onClick={() => onChange(val)}
            className={`flex-1 py-2 rounded-md border text-sm ${value === val ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] font-medium" : "border-[var(--line)] bg-white"}`}>
            {display}
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
      <div className={`text-sm flex-1 ${multiline ? "whitespace-pre-wrap break-words" : ""}`}>{value}</div>
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

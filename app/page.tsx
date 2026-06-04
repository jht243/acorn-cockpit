import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acorn Care - Financial Life Coordination for Families",
  description:
    "A calm, private-client service helping families organize financial, legal, insurance, and estate-readiness details during aging, caregiving, and major life transitions.",
  openGraph: {
    title: "Acorn Care - Financial Life Coordination",
    description:
      "Premium coordination and organization for families navigating aging, caregiving, and major life transitions.",
    type: "website",
  },
};

const STEPS = [
  {
    n: "01",
    title: "Gather",
    body: "We meet your family where you are. Send what you have - statements, policies, wills, beneficiary forms, professional contacts. Nothing has to be complete to begin.",
  },
  {
    n: "02",
    title: "Organize",
    body: "Acorn assembles a clear picture of accounts, policies, estate documents, and benefits. Missing items are surfaced. Conflicting paperwork is flagged.",
  },
  {
    n: "03",
    title: "Coordinate",
    body: "We prepare review-ready packets and coordinate with your attorney, CPA, advisor, broker, and care manager - so decisions move forward without your family chasing every detail.",
  },
  {
    n: "04",
    title: "Maintain",
    body: "Acorn keeps the binder current with a regular review cadence, and quietly stands by when something unexpected happens.",
  },
];

const PROBLEMS: Array<[string, string]> = [
  [
    "An aging parent needs support,",
    "and a new chapter brings questions no one in the family has prepared for.",
  ],
  [
    "Estate documents are scattered,",
    "living in different drawers, inboxes, attorneys' offices, and old folders.",
  ],
  [
    "Insurance and benefits blur together,",
    "between Medicare, long-term care, life, disability, and supplemental policies.",
  ],
  [
    "Advisors are not talking to each other,",
    "and rarely share a single, current picture of the family's financial life.",
  ],
  [
    "Forms are incomplete,",
    "with beneficiaries missing, signatures pending, dates quietly out of date.",
  ],
  [
    "No one knows what happens next,",
    "and decisions stall because no one is responsible for the next step.",
  ],
];

const ORGANIZES: Array<[string, string]> = [
  ["Financial accounts", "Bank, brokerage, retirement, and household cash flow."],
  ["Assets & liabilities", "Property, debts, business interests, and ownership."],
  ["Estate documents", "Wills, trusts, POAs, and healthcare directives."],
  ["Insurance policies", "Life, long-term care, disability, property, supplemental."],
  ["Medical & benefits paperwork", "Medicare, supplemental coverage, and care planning."],
  ["Professionals & next steps", "Attorneys, CPAs, advisors, brokers - and who owes what."],
];

const WHO = [
  "Adult children helping aging parents",
  "Families preparing for care needs",
  "Widows, widowers, and families after loss",
  "Households with scattered documents and advisors",
  "Individuals who want a trusted financial life organizer",
];

const FAQS = [
  {
    q: "What does Acorn Care actually do for my family?",
    a: "Acorn Care is a financial life coordination service. We organize the financial, legal, insurance, medical-benefits, and estate-readiness details your family is juggling, prepare review-ready form packets, and coordinate with your existing attorneys, CPAs, advisors, and brokers - so your family always knows what exists, what is missing, and what needs to happen next.",
  },
  {
    q: "Are you a financial advisor, attorney, or insurance agent?",
    a: "No. Acorn Care does not provide legal, tax, medical, insurance, or investment advice. Those decisions remain with the appropriate licensed professionals. We focus on organization, coordination, preparation, and review - the work that usually falls between professionals and that families end up doing alone at the worst possible moment.",
  },
  {
    q: "Is my family's information private and secure?",
    a: "Yes. Acorn Care operates as a private-client service. Information is handled confidentially, access is limited, and your family decides who is included on any conversation, packet, or shared document.",
  },
  {
    q: "We are already working with an attorney and a CPA. Do we still need this?",
    a: "Often yes. The attorney drafts; the CPA files; the advisor invests. Acorn sits across all of them - making sure the documents exist, the forms are complete, the beneficiaries are current, and everyone is working from the same picture of your family.",
  },
  {
    q: "When is the right time to engage Acorn Care?",
    a: "Most families come to us during a transition - an aging parent, a diagnosis, a loss, a move, a marriage, or simply the realization that the paperwork has become overwhelming. Earlier is calmer, but it is never too late to organize.",
  },
  {
    q: "How do engagements begin?",
    a: "Every engagement begins with a private consultation. We listen to where your family is, walk through what we organize, and recommend the package that fits. Pricing is shared once we understand your situation.",
  },
];

const PACKAGES = [
  {
    name: "Royal Oak",
    tagline: "Get Organized",
    body: "Financial snapshot, document inventory, accounts, liabilities, cash flow, and a clear set of next steps.",
  },
  {
    name: "Sycamore",
    tagline: "Prepare & Coordinate",
    featured: true,
    body: "Estate readiness, insurance review, tax coordination, professional questions, and review-ready form packet support.",
  },
  {
    name: "Mahogany",
    tagline: "Ongoing Family Concierge",
    body: "Continued support, review calendar, family coordination, priority follow-up, and ongoing organization.",
  },
];

const CONSULTATION_HREF = "https://calendly.com/placeholder";

export default function Home() {
  return (
    <div className="home-page min-h-screen bg-ivory text-charcoal antialiased">
      <header className="sticky top-0 z-40 border-b border-ivory/10 bg-espresso-deep shadow-lg shadow-charcoal/10 backdrop-blur-md">
        <nav className="mx-auto flex max-w-[78rem] items-center justify-between px-6 py-5 lg:px-10">
          <a href="#" className="flex items-center gap-2.5 text-ivory">
            <AcornMark className="h-6 w-6 text-gold" />
            <span className="font-serif text-lg tracking-tight">Acorn Care</span>
          </a>
          <div className="hidden items-center gap-10 lg:flex">
            {[
              ["Who We Help", "#who"],
              ["What We Organize", "#organize"],
              ["How It Works", "#process"],
              ["Acorn Binder", "#binder"],
              ["Packages", "#packages"],
            ].map(([label, href]) => (
              <a key={href} href={href} className="text-[13px] text-ivory/65 transition hover:text-ivory">
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden text-[13px] text-ivory/60 transition hover:text-gold sm:inline">
              Client login
            </Link>
            <Link href="/admin-login" className="hidden text-[13px] text-ivory/60 transition hover:text-gold md:inline">
              Advisor login
            </Link>
            <a href={CONSULTATION_HREF} className="text-[13px] tracking-wide text-gold transition hover:text-ivory">
              Schedule a consultation &rarr;
            </a>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(201,164,106,0.28),transparent_32%),linear-gradient(135deg,rgba(45,73,53,0.96),rgba(26,49,34,0.92)),linear-gradient(90deg,rgba(250,247,241,0.08)_1px,transparent_1px),linear-gradient(rgba(250,247,241,0.08)_1px,transparent_1px)] bg-[length:auto,auto,64px_64px,64px_64px]" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-espresso-deep/50 to-transparent" />

          <div className="mx-auto max-w-[78rem] px-6 pb-32 pt-28 lg:px-10 lg:pb-44 lg:pt-40">
            <div className="home-reveal max-w-5xl">
              <div className="h-px w-20 bg-gradient-to-r from-gold/90 via-gold to-gold/50" />
              <h1 className="mt-10 font-serif text-[2.6rem] leading-[1.04] text-ivory sm:text-[3.6rem] lg:text-[5rem]">
                Financial life coordination
                <br className="hidden sm:block" />
                <span className="text-ivory/70"> for families navigating aging, caregiving, and major transitions.</span>
              </h1>
            </div>

            <div className="home-reveal mt-14 grid gap-10 border-t border-ivory/15 pt-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
              <p className="max-w-xl text-base leading-relaxed text-ivory/80 sm:text-lg">
                Acorn Care organizes the documents, decisions, and professional conversations your family cannot afford
                to miss - from accounts and insurance to estate readiness, benefits, and care-related planning.
              </p>
              <div className="flex flex-col items-start gap-5 lg:items-end">
                <div className="flex flex-wrap items-center gap-4">
                  <PrimaryButton>Schedule a Consultation</PrimaryButton>
                  <Link
                    href="/intake"
                    className="inline-flex items-center justify-center rounded-full border border-ivory/35 px-8 py-3.5 text-sm font-medium tracking-wide text-ivory transition hover:bg-ivory/10"
                  >
                    Start Secure Intake
                  </Link>
                </div>
                <QuietLink href="#process">See how Acorn works</QuietLink>
              </div>
            </div>

            <div className="home-reveal mt-24 text-[11px] uppercase tracking-[0.22em] text-ivory/70">
              Coordination, not advice · Confidential by design · Family-first
            </div>
          </div>
        </section>

        <section className="border-t border-charcoal/10">
          <div className="mx-auto max-w-[78rem] px-6 py-28 lg:px-10 lg:py-36">
            <div className="home-reveal grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
              <div>
                <Eyebrow>When the unexpected becomes daily</Eyebrow>
                <h2 className="mt-8 font-serif text-3xl leading-[1.08] text-charcoal sm:text-[2.6rem] lg:text-[3.25rem]">
                  When life gets complicated,
                  <br />
                  the paperwork does too.
                </h2>
              </div>
              <p className="text-base leading-relaxed text-charcoal/65 sm:text-lg lg:pt-3">
                Families are often left managing scattered documents, confusing forms, and disconnected professionals at
                the exact moment they need clarity most. The work that follows is real, and it almost always falls to
                one person.
              </p>
            </div>

            <div className="home-reveal mt-20 grid gap-x-16 gap-y-12 sm:grid-cols-2">
              {PROBLEMS.map(([lead, tail], i) => (
                <div key={lead} className={i % 2 === 1 ? "sm:mt-12" : undefined}>
                  <div className="font-serif text-xs text-gold">{String(i + 1).padStart(2, "0")}</div>
                  <p className="mt-3 font-serif text-xl leading-snug text-charcoal sm:text-2xl">{lead}</p>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/55 sm:text-base">{tail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="organize" className="bg-ivory text-charcoal">
          <div className="mx-auto max-w-[78rem] px-6 py-28 lg:px-10 lg:py-36">
            <div className="home-reveal grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
              <div>
                <Eyebrow tone="sage">What we organize</Eyebrow>
                <h2 className="mt-8 font-serif text-3xl leading-[1.08] text-espresso-deep sm:text-[2.6rem] lg:text-[3.25rem]">
                  One clear picture of the details your family is juggling.
                </h2>
              </div>
              <p className="text-base leading-relaxed text-charcoal/65 sm:text-lg lg:pt-3">
                We assemble a single, calm source of truth - so nothing important falls through the cracks between
                people, professionals, or seasons of life. Acorn coordinates and organizes; legal, tax, medical,
                insurance, and investment decisions remain with the appropriate licensed professionals.
              </p>
            </div>

            <dl className="home-reveal mt-20 grid gap-x-16 gap-y-10 sm:grid-cols-2">
              {ORGANIZES.map(([title, body], i) => (
                <div key={title} className="flex gap-6 border-t border-charcoal/15 pt-6">
                  <span className="font-serif text-sm text-acorn">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <dt className="font-serif text-xl text-espresso-deep sm:text-2xl">{title}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-charcoal/65 sm:text-[15px]">{body}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="process" className="border-t border-charcoal/10">
          <div className="mx-auto max-w-[78rem] px-6 py-28 lg:px-10 lg:py-36">
            <div className="home-reveal max-w-3xl">
              <Eyebrow>The Acorn process</Eyebrow>
              <h2 className="mt-8 font-serif text-3xl leading-[1.08] sm:text-[2.6rem] lg:text-[3.25rem]">
                A simple process for complex family decisions.
              </h2>
            </div>

            <ol className="mt-20 divide-y divide-charcoal/10 border-y border-charcoal/10">
              {STEPS.map((step) => (
                <li
                  key={step.n}
                  className="home-reveal grid gap-6 py-12 sm:grid-cols-[6rem_1fr_2fr] sm:gap-12 sm:py-14"
                >
                  <div className="font-serif text-3xl text-gold sm:text-4xl">{step.n}</div>
                  <h3 className="font-serif text-2xl leading-tight text-charcoal sm:text-[2rem]">{step.title}</h3>
                  <p className="max-w-xl text-base leading-relaxed text-charcoal/65 sm:text-lg">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="binder" className="bg-cream text-charcoal">
          <div className="mx-auto max-w-[78rem] px-6 py-28 lg:px-10 lg:py-36">
            <div className="home-reveal grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
              <div className="lg:pt-6">
                <Eyebrow tone="acorn">The Acorn Binder</Eyebrow>
                <h2 className="mt-8 font-serif text-3xl leading-[1.08] text-espresso-deep sm:text-[2.6rem] lg:text-[3.25rem]">
                  Your family&apos;s financial life, organized in one place.
                </h2>
                <p className="mt-8 max-w-md text-base leading-relaxed text-charcoal/70 sm:text-lg">
                  Every Acorn engagement produces a living family record: what exists, what is missing, who is
                  responsible, and what needs attention next. Quiet, considered, and entirely your family&apos;s.
                </p>
                <div className="mt-10">
                  <QuietLink href="#consultation" tone="espresso">
                    See it in your consultation
                  </QuietLink>
                </div>
              </div>

              <div className="border border-charcoal/12 bg-ivory shadow-[0_40px_80px_-40px_rgba(40,30,20,0.35)]">
                <div className="flex items-center justify-between border-b border-charcoal/10 px-7 py-5">
                  <div className="flex items-center gap-2.5">
                    <AcornMark className="h-5 w-5 text-acorn" />
                    <span className="font-serif text-base text-espresso-deep">The Whitmore Family</span>
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-charcoal/50">Updated today</span>
                </div>

                <div className="divide-y divide-charcoal/10 px-7">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 py-6">
                    <BinderStat label="Documents organized" value="28" suffix=" / 34" />
                    <BinderStat label="Professionals coordinated" value="4" suffix=" active" />
                  </div>

                  <div className="py-6">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-charcoal/50">Currently in motion</p>
                    <ul className="mt-4 space-y-3 text-[15px] text-charcoal/85">
                      <BinderTask label="Beneficiary update - IRA" status="Review" color="text-acorn" />
                      <BinderTask label="Healthcare directive" status="Drafting" color="text-forest" />
                      <BinderTask label="Long-term care claim packet" status="Queued" color="text-charcoal/55" />
                    </ul>
                  </div>

                  <div className="py-6">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-acorn">
                      Missing - flagged for attention
                    </p>
                    <ul className="mt-4 space-y-2 text-[15px] text-charcoal/85">
                      <li>Updated will (post-2019)</li>
                      <li>Long-term care policy declarations</li>
                      <li>Trust funding confirmation</li>
                    </ul>
                  </div>

                  <div className="flex items-baseline justify-between py-6">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-charcoal/50">Next review</p>
                    <p className="font-serif text-base text-espresso-deep">Estate readiness call · April 14</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-charcoal/10">
          <div className="mx-auto max-w-[78rem] px-6 py-28 lg:px-10 lg:py-36">
            <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
              <div className="home-reveal">
                <Eyebrow>Guided intake</Eyebrow>
                <h2 className="mt-8 font-serif text-3xl leading-[1.08] sm:text-[2.4rem] lg:text-[3rem]">
                  A calmer way to share what your family has.
                </h2>
                <p className="mt-8 max-w-lg text-base leading-relaxed text-charcoal/70 sm:text-lg">
                  Instead of overwhelming forms, Acorn guides families one question at a time - with the option to
                  upload a document whenever the answer is not clear. A real person reviews every step before anything
                  moves forward.
                </p>
                <ul className="mt-10 space-y-4 border-t border-charcoal/10 pt-6 text-[15px] text-charcoal/75">
                  {[
                    "Step-by-step prompts, never a wall of fields",
                    "Upload-anything support when answers are unclear",
                    "A human reviews every step before signature",
                  ].map((item) => (
                    <li key={item} className="flex items-baseline gap-4">
                      <span className="h-px w-6 flex-none translate-y-2 bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/intake"
                  className="mt-10 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-espresso-deep/85 transition hover:text-espresso-deep"
                >
                  Start Secure Intake
                  <span>&rarr;</span>
                </Link>
              </div>

              <div className="home-reveal lg:pt-2">
                <div className="border border-charcoal/12 bg-sage-soft/60 px-8 py-9 sm:px-10 sm:py-11">
                  <div className="flex items-baseline justify-between text-[11px] uppercase tracking-[0.22em] text-charcoal/50">
                    <span>Step 02 of 06</span>
                    <span>Professional Team</span>
                  </div>
                  <h3 className="mt-6 font-serif text-2xl leading-snug text-charcoal sm:text-[1.75rem]">
                    Who helps your family with legal, tax, financial, insurance, or care-related decisions?
                  </h3>

                  <ul className="mt-8 divide-y divide-charcoal/10 border-y border-charcoal/10">
                    {[
                      ["Estate attorney", true],
                      ["CPA / tax professional", false],
                      ["Financial advisor", true],
                      ["Insurance broker", false],
                      ["Care manager", false],
                      ["I'm not sure yet", false],
                    ].map(([label, selected]) => (
                      <li key={String(label)} className="flex items-center gap-4 py-3.5 text-[15px] text-charcoal/85">
                        <span
                          className={`flex h-4 w-4 flex-none items-center justify-center border ${
                            selected ? "border-gold bg-gold/90" : "border-charcoal/30"
                          }`}
                        >
                          {selected ? <CheckMark /> : null}
                        </span>
                        {label}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-7 text-[13px] italic leading-relaxed text-charcoal/55">
                    Not sure? Skip this - Acorn will help identify what is missing in your next call.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="who" className="border-t border-charcoal/10">
          <div className="mx-auto max-w-[78rem] px-6 py-28 lg:px-10 lg:py-36">
            <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
              <div className="home-reveal min-h-[34rem] overflow-hidden border border-charcoal/10 bg-[radial-gradient(circle_at_35%_30%,rgba(201,164,106,0.32),transparent_28%),linear-gradient(145deg,rgba(220,226,214,0.88),rgba(250,247,241,0.88)),linear-gradient(135deg,rgba(45,73,53,0.18)_0_25%,transparent_25%_50%,rgba(45,73,53,0.12)_50%_75%,transparent_75%)]" />
              <div className="home-reveal lg:pt-6">
                <Eyebrow>Who we help</Eyebrow>
                <h2 className="mt-8 font-serif text-3xl leading-[1.08] sm:text-[2.4rem] lg:text-[3rem]">
                  Support for families at the moments clarity matters most.
                </h2>
                <p className="mt-8 max-w-md text-base leading-relaxed text-charcoal/65 sm:text-lg">
                  Acorn works alongside families when decisions are layered, time is short, and no one should be
                  navigating it alone.
                </p>

                <ul className="mt-12 divide-y divide-charcoal/10 border-y border-charcoal/10">
                  {WHO.map((label, i) => (
                    <li key={label} className="flex items-baseline gap-6 py-5 text-[17px] text-charcoal/85">
                      <span className="font-serif text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-serif text-lg sm:text-xl">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-cream text-charcoal">
          <div className="mx-auto grid max-w-[78rem] items-center gap-16 px-6 py-28 lg:grid-cols-[1fr_1.3fr] lg:gap-24 lg:px-10 lg:py-36">
            <div className="home-reveal order-2 lg:order-1">
              <div className="min-h-[32rem] overflow-hidden border border-charcoal/10 bg-[radial-gradient(circle_at_50%_18%,rgba(250,247,241,0.8),transparent_22%),linear-gradient(160deg,rgba(170,178,150,0.5),rgba(45,73,53,0.2)),linear-gradient(90deg,rgba(40,30,20,0.08)_1px,transparent_1px),linear-gradient(rgba(40,30,20,0.08)_1px,transparent_1px)] bg-[length:auto,auto,40px_40px,40px_40px]" />
            </div>
            <div className="home-reveal order-1 lg:order-2">
              <Eyebrow tone="sage">Our story</Eyebrow>
              <h2 className="mt-8 font-serif text-3xl leading-[1.08] text-espresso-deep sm:text-[2.4rem] lg:text-[3rem]">
                Built by someone who has lived the caregiving maze.
              </h2>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-charcoal/70 sm:text-lg">
                Karli Vazquez-Mendez brings over two decades of expertise across global financial institutions -
                blending technical excellence with a personalized, human approach to wealth management.
              </p>
              <div className="mt-10 flex items-center gap-4">
                <div className="h-px w-12 bg-acorn/50" />
                <span className="font-serif text-base text-espresso-deep">
                  Founder &amp; Lead Coordinator, Acorn Care
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-charcoal/10">
          <div className="mx-auto max-w-[78rem] px-6 py-28 lg:px-10 lg:py-36">
            <div className="home-reveal grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
              <div>
                <Eyebrow>Questions families ask</Eyebrow>
                <h2 className="mt-8 font-serif text-3xl leading-[1.08] sm:text-[2.4rem] lg:text-[3rem]">
                  What families want to know before we begin.
                </h2>
                <p className="mt-8 max-w-sm text-base leading-relaxed text-charcoal/60">
                  A short, honest overview of how Acorn engages, what we do, and what remains with your licensed
                  professionals.
                </p>
              </div>

              <div className="divide-y divide-charcoal/10 border-y border-charcoal/10">
                {FAQS.map((faq, i) => (
                  <details key={faq.q} className="group py-7" open={i === 0}>
                    <summary className="flex cursor-pointer list-none items-baseline gap-6">
                      <span className="font-serif text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1 font-serif text-xl leading-snug text-charcoal sm:text-2xl">
                        {faq.q}
                      </span>
                      <span className="font-serif text-2xl text-charcoal/40 transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-5 max-w-3xl pl-[3.25rem] text-[15px] leading-relaxed text-charcoal/65 sm:text-base">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="packages" className="bg-ivory text-charcoal">
          <div className="mx-auto max-w-[78rem] px-6 py-28 lg:px-10 lg:py-36">
            <div className="home-reveal grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
              <div>
                <Eyebrow tone="sage">Engagements</Eyebrow>
                <h2 className="mt-8 font-serif text-3xl leading-[1.08] text-espresso-deep sm:text-[2.4rem] lg:text-[3rem]">
                  Choose the level of support your family needs.
                </h2>
              </div>
              <p className="text-base leading-relaxed text-charcoal/65 sm:text-lg lg:pt-3">
                Every engagement begins with a private consultation. Pricing is shared after we understand your
                family&apos;s situation - there are no public price lists, and no obligation to continue.
              </p>
            </div>

            <div className="home-reveal mt-20 grid divide-y divide-charcoal/15 border-y border-charcoal/15 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
              {PACKAGES.map((pkg) => (
                <div key={pkg.name} className="flex flex-col px-2 py-10 lg:px-10 lg:py-12">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] uppercase tracking-[0.22em] text-acorn">{pkg.tagline}</span>
                    {pkg.featured ? (
                      <span className="text-[10px] uppercase tracking-[0.22em] text-charcoal/45">Most chosen</span>
                    ) : null}
                  </div>
                  <h3 className="mt-6 font-serif text-3xl text-espresso-deep sm:text-4xl">{pkg.name}</h3>
                  <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-charcoal/70">{pkg.body}</p>
                  <div className="mt-8 pt-2">
                    <a href="#consultation" className="group inline-flex items-center gap-2 text-sm tracking-wide text-espresso-deep">
                      Discuss this engagement
                      <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="consultation" className="relative overflow-hidden border-t border-ivory/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,164,106,0.35),transparent_24%),linear-gradient(145deg,rgba(45,73,53,0.94),rgba(26,49,34,0.92))]" />
          <div className="relative mx-auto max-w-4xl px-6 py-32 text-center lg:py-40">
            <Eyebrow>Begin quietly</Eyebrow>
            <h2 className="mx-auto mt-8 font-serif text-4xl leading-[1.02] text-ivory sm:text-6xl lg:text-7xl">
              Start with clarity.
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-ivory/70 sm:text-lg">
              Schedule a consultation to understand what your family has, what is missing, and what needs attention
              next.
            </p>
            <div className="mt-12 flex justify-center">
              <PrimaryButton>Schedule a Consultation</PrimaryButton>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-ivory/10 bg-espresso-deep">
        <div className="mx-auto flex max-w-[78rem] flex-col gap-6 px-6 py-12 sm:flex-row sm:items-start sm:justify-between lg:px-10">
          <div className="flex items-center gap-2.5 text-ivory">
            <AcornMark className="h-6 w-6 text-gold" />
            <span className="font-serif text-lg">Acorn Care</span>
          </div>
          <p className="max-w-xl text-xs leading-relaxed text-ivory/45">
            Acorn Care provides organization, coordination, and preparation support. We do not provide legal, tax,
            medical, insurance, or investment advice. Those decisions remain with the appropriate licensed professionals.
          </p>
          <p className="text-xs text-ivory/45">© {new Date().getFullYear()} Acorn Care</p>
        </div>
      </footer>
    </div>
  );
}

function AcornMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="32" cy="32" r="28" strokeWidth="2" />
        <path
          strokeWidth="1.6"
          d="M32 11c-2.3 0-4.2 1.3-5.1 3.2-.5-.2-1-.3-1.6-.3-2.5 0-4.5 2-4.5 4.5 0 .7.2 1.4.5 2-1.8.6-3.1 2.3-3.1 4.3 0 2.5 2 4.5 4.5 4.5.7 0 1.4-.2 2-.5.8 1.5 2.4 2.5 4.2 2.5 1.2 0 2.3-.4 3.1-1.2.8.8 1.9 1.2 3.1 1.2 1.8 0 3.4-1 4.2-2.5.6.3 1.3.5 2 .5 2.5 0 4.5-2 4.5-4.5 0-2-1.3-3.7-3.1-4.3.3-.6.5-1.3.5-2 0-2.5-2-4.5-4.5-4.5-.6 0-1.1.1-1.6.3C36.2 12.3 34.3 11 32 11z"
        />
        <path strokeWidth="1" d="M27 19c1 1.5 2.5 2.5 4 3M37 19c-1 1.5-2.5 2.5-4 3M24 24c1.5.5 3 .5 4.5 0M40 24c-1.5.5-3 .5-4.5 0M32 16v6" />
        <path strokeWidth="2.2" d="M32 30v18" />
        <path
          strokeWidth="1.4"
          d="M32 48c-2 1.5-4 2.4-7 2.8M32 48c2 1.5 4 2.4 7 2.8M32 48c-3 1.8-5 3.8-7 6M32 48c3 1.8 5 3.8 7 6M32 48c-1 2-1.5 4-1.5 6M32 48c1 2 1.5 4 1.5 6M32 48v6"
        />
      </g>
    </svg>
  );
}

function Eyebrow({
  children,
  tone = "gold",
}: {
  children: React.ReactNode;
  tone?: "gold" | "sage" | "acorn";
}) {
  const color = tone === "gold" ? "text-gold" : tone === "sage" ? "text-sage" : "text-acorn";
  return (
    <span className={`inline-flex items-center gap-3 text-[10.5px] font-medium uppercase tracking-[0.28em] ${color}`}>
      <span className="h-px w-6 bg-current opacity-60" />
      {children}
    </span>
  );
}

function PrimaryButton({ children, href = CONSULTATION_HREF }: { children: React.ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3.5 text-sm font-medium tracking-wide text-espresso-deep transition hover:brightness-95"
    >
      {children}
    </a>
  );
}

function QuietLink({
  children,
  href,
  tone = "ivory",
}: {
  children: React.ReactNode;
  href: string;
  tone?: "ivory" | "espresso";
}) {
  const cls = tone === "ivory" ? "text-ivory/80 hover:text-ivory" : "text-espresso-deep/80 hover:text-espresso-deep";
  return (
    <a href={href} className={`group inline-flex items-center gap-2 text-sm tracking-wide ${cls}`}>
      {children}
      <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
    </a>
  );
}

function BinderStat({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-charcoal/50">{label}</p>
      <p className="mt-2 font-serif text-3xl text-espresso-deep">
        {value}
        <span className="text-charcoal/40">{suffix}</span>
      </p>
    </div>
  );
}

function BinderTask({ label, status, color }: { label: string; status: string; color: string }) {
  return (
    <li className="flex items-baseline justify-between gap-4">
      <span>{label}</span>
      <span className={`text-xs uppercase tracking-[0.16em] ${color}`}>{status}</span>
    </li>
  );
}

function CheckMark() {
  return (
    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-espresso-deep" fill="none" aria-hidden="true">
      <path d="M2 6.5 5 9.5 10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

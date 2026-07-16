import type { Metadata } from "next";
import Link from "next/link";
import PainPointsSlider from "../components/PainPointsSlider";
import ContactForm from "../components/ContactForm";
import HeroCards from "../components/HeroCards";
import MobileNav from "../components/MobileNav";

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
    body: "Send what you have — statements, policies, wills, beneficiary forms, professional contacts. Nothing needs to be complete or organized to begin. We meet your family where you are.",
  },
  {
    n: "02",
    title: "Organize",
    body: "Acorn builds a clear picture of your accounts, policies, estate documents, and benefits. Missing items are surfaced. Conflicting paperwork is flagged. You'll know exactly where things stand.",
  },
  {
    n: "03",
    title: "Coordinate",
    body: "We prepare review-ready packets and reach out to your attorney, CPA, advisor, broker, and care manager — so every professional has what they need, and decisions stop waiting on information.",
  },
  {
    n: "04",
    title: "Maintain",
    body: "Life changes. Acorn keeps the Binder current, tracks follow-ups, and quietly stands by when something unexpected happens — so you're never starting from scratch again.",
  },
];

const PROBLEMS: Array<[string, string]> = [
  [
    "An aging parent needs support,",
    "and suddenly someone needs to know where every account, policy, and document lives — often for the first time.",
  ],
  [
    "Estate documents are scattered,",
    "between old folders, attorneys' offices, filing cabinets, and email threads no one can find.",
  ],
  [
    "Insurance and benefits blur together,",
    "and no one is sure what's covered, what's lapsed, or what's being paid for twice.",
  ],
  [
    "Advisors are not talking to each other,",
    "so the CPA doesn't know what the attorney drafted, and the advisor doesn't know what either of them said.",
  ],
  [
    "Forms are incomplete,",
    "beneficiary designations are outdated, signatures are missing, and no one noticed until it was too late.",
  ],
  [
    "No one knows what happens next,",
    "so decisions stall, responsibilities go unassigned, and the family stays in limbo.",
  ],
];

const ORGANIZES: Array<[string, string]> = [
  ["Financial accounts", "Bank, brokerage, retirement, and household cash flow — mapped and current."],
  ["Assets & liabilities", "Property, debts, business interests, and ownership — nothing hidden or forgotten."],
  ["Estate documents", "Wills, trusts, POAs, and healthcare directives — with gaps flagged for your attorney."],
  ["Insurance policies", "Life, long-term care, disability, property, supplemental — reviewed for lapses and overlaps."],
  ["Medical & benefits paperwork", "Medicare, supplemental coverage, and care planning — organized before you need it."],
  ["Professionals & next steps", "Attorneys, CPAs, advisors, brokers — who owes what, and what happens next."],
];

const WHO = [
  "An adult child coordinating care for an aging parent",
  "A family preparing for what happens if something goes wrong",
  "A widow or widower navigating finances alone for the first time",
  "A couple whose estate documents haven't been touched in a decade",
  "A real estate investor or small business owner with scattered financial relationships",
  "Someone who just inherited assets and doesn't know where to start",
  "Anyone who wants one trusted person watching over the full picture",
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
  {
    q: "My situation doesn't fit neatly into any of these. Can Acorn still help?",
    a: "Probably yes. Acorn works with clients across a wide range of situations — from ongoing family coordination to one-time questions about investing, real estate, estate readiness, entity structure, benefits, or insurance. If you're not sure whether it's a fit, a 30-minute consultation costs nothing and answers that question quickly.",
  },
];

const PACKAGES = [
  {
    name: "Royal Oak",
    tagline: "Get Organized",
    body: "Financial snapshot, document inventory, accounts, liabilities, cash flow, and a clear set of next steps.",
    outcome: "At the end, you'll know exactly what you have, what's missing, and what needs attention.",
  },
  {
    name: "Sycamore",
    tagline: "Prepare & Coordinate",
    featured: true,
    body: "Estate readiness, insurance review, tax coordination, professional questions, and review-ready form packet support.",
    outcome: "You'll be prepared for any meeting with any professional.",
  },
  {
    name: "Mahogany",
    tagline: "Ongoing Family Concierge",
    body: "Continued support, review calendar, family coordination, priority follow-up, and ongoing organization.",
    outcome: "Nothing falls through the cracks while life keeps moving.",
  },
];

const CLARITY_SESSION = {
  name: "Clarity Session",
  tagline: "One-Time Consultation",
  body: "For individuals with a specific question — about investing, real estate, estate readiness, benefits, entity structure, or anything else. A focused 60-minute session with no ongoing commitment.",
  outcome: "You'll leave with clear next steps and a better understanding of your options.",
};

const CONSULTATION_HREF = "https://calendly.com/karli-acorn-care/30min";

export default function Home() {
  return (
    <div className="home-page min-h-screen bg-ivory text-charcoal antialiased">
      <header className="sticky top-0 z-40 border-b border-ivory/10 bg-espresso-deep shadow-lg shadow-charcoal/10 backdrop-blur-md">
        <nav className="relative mx-auto flex max-w-[78rem] items-center justify-between px-6 py-5 lg:px-10">
          <a href="#" className="flex items-center gap-2.5 text-ivory">
            {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://imgur.com/hkTt23u.png" alt="Acorn Care" className="h-8 w-8 object-contain" />
            <span className="font-serif text-lg tracking-tight">Acorn Care</span>
          </a>
          <div className="hidden items-center gap-10 lg:flex">
            {[
              ["What We Organize", "#organize"],
              ["How It Works", "#process"],
              ["Our Story", "/our-story"],
              ["Packages", "#packages"],
              ["Start Intake", "/intake"],
            ].map(([label, href]) => (
              <a key={href} href={href} className="text-[13px] text-ivory/65 transition hover:text-ivory">
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <a href={CONSULTATION_HREF} target="_blank" rel="noopener noreferrer" className="hidden text-[13px] tracking-wide text-gold transition hover:text-ivory sm:inline">
              Let&apos;s Chat &rarr;
            </a>
            <MobileNav />
          </div>
        </nav>
      </header>

      <main>
        {/* SECTION 1 — HERO */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(201,164,106,0.28),transparent_32%),linear-gradient(135deg,rgba(45,73,53,0.96),rgba(26,49,34,0.92)),linear-gradient(90deg,rgba(250,247,241,0.08)_1px,transparent_1px),linear-gradient(rgba(250,247,241,0.08)_1px,transparent_1px)] bg-[length:auto,auto,64px_64px,64px_64px]" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-espresso-deep/50 to-transparent" />

          <div className="mx-auto max-w-[78rem] px-6 pb-20 pt-28 lg:px-10 lg:pb-28 lg:pt-40">

            {/* Two-column split: text left, animation right */}
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">

              {/* Left — heading + description + CTA */}
              <div className="home-reveal">
                <div className="h-px w-20 bg-gradient-to-r from-gold/90 via-gold to-gold/50" />
                <h1 className="mt-10 font-serif text-[2.6rem] leading-[1.04] text-ivory sm:text-[3.6rem] lg:text-[4.5rem]">
                  Aggregate. Organize. Implement.
                </h1>
                <p className="mt-5 text-lg font-medium tracking-wide text-ivory/70 sm:text-xl">
                  Your family&apos;s Life Operating System.
                </p>
                <div className="mt-10 border-t border-ivory/15 pt-10">
                  <p className="max-w-xl text-base leading-relaxed text-ivory/80 sm:text-lg">
                    Acorn Care organizes what your family has, finds what&apos;s missing, and makes sure the right professionals have what they need.
                  </p>
                  <div className="mt-8">
                    <PrimaryButton>Schedule a Consultation</PrimaryButton>
                  </div>
                </div>
              </div>

              {/* Right — Card stack */}
              <div className="home-reveal">
                <HeroCards />
              </div>

            </div>
          </div>
        </section>

        <PainPointsSlider />

        {/* SECTION 2 — PAIN POINTS */}
        <section className="border-t border-charcoal/10">
          <div className="mx-auto max-w-[78rem] px-6 py-28 lg:px-10 lg:py-36">
            <div className="home-reveal mb-16 text-center">
              <h2 className="font-serif text-3xl leading-[1.08] text-charcoal sm:text-[2.6rem] lg:text-[3.25rem]">
                When life gets complicated, the paperwork does too.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-charcoal/65 sm:text-lg">
                At the exact moment families need clarity most, they&apos;re handed a pile of paperwork and a list of people to call. The work is real. The coordination is exhausting. And it almost always falls to one person.
              </p>
            </div>

            <ol className="home-reveal mt-20 divide-y divide-charcoal/10 border-y border-charcoal/10">
              {PROBLEMS.map(([lead, tail], i) => (
                <li key={lead} className="grid gap-6 py-10 sm:grid-cols-[6rem_1fr_2fr] sm:gap-12 sm:py-12">
                  <div className="font-serif text-3xl text-gold sm:text-4xl">{String(i + 1).padStart(2, "0")}</div>
                  <p className="font-serif text-xl leading-snug text-charcoal sm:text-2xl">{lead}</p>
                  <p className="text-base leading-relaxed text-charcoal/55">{tail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* SECTION 2b — SEASONS OF LIFE */}
        <section className="border-t border-charcoal/10 bg-cream text-charcoal">
          <div className="mx-auto max-w-[78rem] px-6 py-28 lg:px-10 lg:py-36">
            <div className="home-reveal mb-16 text-center">
              <h2 className="font-serif text-3xl leading-[1.08] text-espresso-deep sm:text-[2.6rem] lg:text-[3.25rem]">
                Seasons of life when families find us.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-charcoal/65 sm:text-lg">
                There is rarely a perfect moment to get organized. Most families come to us during a transition — and that&apos;s exactly when we&apos;re built to help.
              </p>
            </div>
            <ul className="home-reveal mt-16 flex flex-wrap justify-center gap-3">
              {WHO.map((item) => (
                <li key={item} className="rounded-full border border-charcoal/20 bg-ivory px-5 py-2.5 text-sm leading-snug text-charcoal/75">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SECTION 3 — WHAT WE ORGANIZE */}
        <section id="organize" className="bg-ivory text-charcoal">
          <div className="mx-auto max-w-[78rem] px-6 py-28 lg:px-10 lg:py-36">
            <div className="home-reveal mb-16 text-center">
              <h2 className="font-serif text-3xl leading-[1.08] text-espresso-deep sm:text-[2.6rem] lg:text-[3.25rem]">
                Nothing important should fall through the cracks.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-charcoal/65 sm:text-lg">
                Acorn assembles a single, clear record of everything your family has — and everything it&apos;s missing. The decisions stay with your professionals. The organization, the gaps, and the follow-through stay with us.
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

        {/* SECTION 4 — PROCESS */}
        <section id="process" className="border-t border-charcoal/10">
          <div className="mx-auto max-w-[78rem] px-6 py-28 lg:px-10 lg:py-36">
            <div className="home-reveal mb-4 text-center">
              <h2 className="font-serif text-3xl leading-[1.08] sm:text-[2.6rem] lg:text-[3.25rem]">
                From scattered to sorted.
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

        {/* SECTION 5 — ACORN BINDER */}
        <section id="binder" className="bg-cream text-charcoal">
          <div className="mx-auto max-w-[78rem] px-6 py-28 lg:px-10 lg:py-36">
            <div className="home-reveal grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
              <div className="lg:pt-6">
                <h2 className="mt-8 font-serif text-3xl leading-[1.08] text-espresso-deep sm:text-[2.6rem] lg:text-[3.25rem]">
                  Your family&apos;s financial life, organized in one place.
                </h2>
                <p className="mt-8 max-w-md text-base leading-relaxed text-charcoal/70 sm:text-lg">
                  Every Acorn engagement produces a living family record — what exists, what&apos;s missing, who&apos;s responsible, and what needs attention next. It&apos;s what every family should have, and almost no one does.
                </p>
                <div className="mt-10">
                  <QuietLink href="#consultation" tone="espresso">
                    See what your family&apos;s Binder could look like
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

        {/* SECTION 6 — INTAKE MOCKUP */}
        <section className="border-t border-charcoal/10">
          <div className="mx-auto max-w-[78rem] px-6 py-28 lg:px-10 lg:py-36">
            <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
              <div className="home-reveal">
                <h2 className="mt-8 font-serif text-3xl leading-[1.08] sm:text-[2.4rem] lg:text-[3rem]">
                  A guided way to finally get it all in one place.
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
                    "A real person reviews every submission before anything moves forward.",
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

        {/* SECTION 8 — OUR STORY */}
        <section className="bg-cream text-charcoal">
          <div className="mx-auto grid max-w-[78rem] items-center gap-16 px-6 py-28 lg:grid-cols-[1fr_1.3fr] lg:gap-24 lg:px-10 lg:py-36">
            <div className="home-reveal order-2 lg:order-1">
              <div className="min-h-[20rem] overflow-hidden border border-charcoal/10 sm:min-h-[28rem] lg:min-h-[32rem]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/karli-bio.jpeg"
                  alt="Karli Vazquez-Mendez, Founder & Lead Coordinator of Acorn Care"
                  className="h-full w-full object-cover object-top"
                  style={{ minHeight: 'inherit' }}
                />
              </div>
            </div>
            <div className="home-reveal order-1 lg:order-2">
              <h2 className="mt-8 font-serif text-3xl leading-[1.08] text-espresso-deep sm:text-[2.4rem] lg:text-[3rem]">
                Built by someone who has lived the caregiving maze.
              </h2>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-charcoal/70 sm:text-lg">
                Karli Vazquez-Mendez spent over twenty years inside the financial system — at Merrill Lynch, Citi Private Bank, Morgan Stanley, and First Republic Bank — watching families get lost in the gaps between professionals, paperwork, and plans that didn&apos;t talk to each other. She built Acorn Care because she knew what was missing: not another advocate, but someone whose only job is to see the whole picture and make sure nothing falls through the cracks.
              </p>
              <div className="mt-10 flex items-center gap-4">
                <div className="h-px w-12 bg-acorn/50" />
                <span className="font-serif text-base text-espresso-deep">
                  Founder &amp; Lead Coordinator, Acorn Care
                </span>
              </div>
              <a
                href="https://www.linkedin.com/in/karli-vazquez-mendez/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2.5 text-[13px] text-charcoal/55 transition hover:text-espresso-deep"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current" aria-hidden="true">
                  <path d="M20.447 20.452H17.01v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.589V9h3.318v1.561h.046c.462-.872 1.588-1.791 3.268-1.791 3.494 0 4.139 2.301 4.139 5.293v6.389zM5.337 7.433a1.931 1.931 0 1 1 0-3.862 1.931 1.931 0 0 1 0 3.862zM6.97 20.452H3.697V9H6.97v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Connect with Karli on LinkedIn
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 9 — TESTIMONIALS */}
        <section className="border-t border-ivory/10 bg-espresso-deep text-ivory">
          <div className="mx-auto max-w-[78rem] px-6 py-28 lg:px-10 lg:py-36">

            <div className="home-reveal mb-16 text-center">
              <h2 className="font-serif text-3xl leading-[1.08] text-ivory sm:text-[2.4rem] lg:text-[3rem]">
                What families are saying.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ivory/55 sm:text-lg">
                Every family&apos;s situation is different. These are a few of the moments we&apos;ve been trusted to help navigate.
              </p>
            </div>

            <div className="home-reveal mt-20 grid gap-px border border-ivory/10 bg-ivory/10 md:grid-cols-3">
              {[
                {
                  quote: "Karli combines expertise with genuine care. She made us feel like more than just clients — she made us feel understood. Her guidance has been invaluable, and we trust her completely with our financial future.",
                  name: "— Dr. Ryan and Chere Smith",
                  role: "Family Financial Coordination",
                },
                {
                  quote: "Karli is the rare advisor who truly listens. She helped me clarify my long-term goals and created a plan that felt both strategic and deeply personal. Her attention to detail and ability to simplify complex concepts made the entire process empowering.",
                  name: "— Rachel Stevens",
                  role: "Long-Term Wealth Organization",
                },
                {
                  quote: "Karli delivers a level of service that's truly exceptional. Her ability to tailor solutions based on my specific, and complex, personal and business needs, was impressive, and her follow-through was flawless. She's the kind of advisor you want in your corner.",
                  name: "— Dayanara Diaz",
                  role: "Personal Asset Coordination",
                },
              ].map((t, i) => (
                <div key={i} className="flex flex-col justify-between gap-10 bg-espresso-deep px-8 py-10 lg:px-10 lg:py-12">
                  <p
                    className="font-serif text-[1.05rem] leading-relaxed text-ivory/80"
                    style={{ fontStyle: "italic" }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="border-t border-ivory/10 pt-6">
                    <p className="font-serif text-base text-ivory">{t.name}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-gold/70">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* SECTION 10 — FAQ */}
        <section className="border-t border-charcoal/10">
          <div className="mx-auto max-w-[78rem] px-6 py-28 lg:px-10 lg:py-36">
            <div className="home-reveal mb-16 text-center">
              <h2 className="font-serif text-3xl leading-[1.08] sm:text-[2.4rem] lg:text-[3rem]">
                What families want to know before we begin.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-charcoal/60">
                A short, honest overview of how Acorn engages, what we do, and what remains with your licensed professionals.
              </p>
            </div>

            <div className="home-reveal">
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

        {/* SECTION 11 — PACKAGES */}
        <section id="packages" className="bg-ivory text-charcoal">
          <div className="mx-auto max-w-[78rem] px-6 py-28 lg:px-10 lg:py-36">
            <div className="home-reveal mb-16 text-center">
              <h2 className="font-serif text-3xl leading-[1.08] text-espresso-deep sm:text-[2.4rem] lg:text-[3rem]">
                Choose the level of support your family needs.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-charcoal/65 sm:text-lg">
                Every engagement begins with a private consultation. Pricing is shared after we understand your situation — most families are surprised by how accessible this is. No obligation to continue.
              </p>
            </div>

            <div className="home-reveal mt-20 grid divide-y divide-charcoal/15 border-y border-charcoal/15 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
              {PACKAGES.map((pkg) => (
                <div key={pkg.name} className="flex flex-col px-6 py-10 lg:px-10 lg:py-12">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] uppercase tracking-[0.22em] text-acorn">{pkg.tagline}</span>
                    {pkg.featured ? (
                      <span className="text-[10px] uppercase tracking-[0.22em] text-charcoal/45">Most chosen</span>
                    ) : null}
                  </div>
                  <h3 className="mt-6 font-serif text-3xl text-espresso-deep sm:text-4xl">{pkg.name}</h3>
                  <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-charcoal/70">{pkg.body}</p>
                  <p className="mt-4 text-[13px] leading-relaxed text-charcoal/50 italic">{pkg.outcome}</p>
                  <div className="mt-8 pt-2">
                    <a href="#consultation" className="group inline-flex items-center gap-2 text-sm tracking-wide text-espresso-deep">
                      Discuss this engagement
                      <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Clarity Session — one-time card */}
            <div className="home-reveal mt-6 border border-charcoal/15">
              <div className="flex flex-col px-2 py-10 lg:flex-row lg:items-start lg:gap-16 lg:px-10 lg:py-12">
                <div className="lg:w-56 lg:shrink-0">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-acorn">{CLARITY_SESSION.tagline}</span>
                  <h3 className="mt-6 font-serif text-3xl text-espresso-deep sm:text-4xl">{CLARITY_SESSION.name}</h3>
                </div>
                <div className="mt-6 flex-1 lg:mt-0">
                  <p className="max-w-xl text-[15px] leading-relaxed text-charcoal/70">{CLARITY_SESSION.body}</p>
                  <p className="mt-4 text-[13px] leading-relaxed text-charcoal/50 italic">{CLARITY_SESSION.outcome}</p>
                  <div className="mt-8">
                    <a href="#consultation" className="group inline-flex items-center gap-2 text-sm tracking-wide text-espresso-deep">
                      Discuss this engagement
                      <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 12 — FINAL CTA */}
        <section id="consultation" className="relative overflow-hidden border-t border-ivory/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,164,106,0.35),transparent_24%),linear-gradient(145deg,rgba(45,73,53,0.94),rgba(26,49,34,0.92))]" />
          <div className="relative mx-auto max-w-[78rem] px-6 py-24 lg:px-10 lg:py-36">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
              {/* Left: heading + description + CTA */}
              <div className="flex flex-col justify-center">
                <h2 className="mt-8 font-serif text-4xl leading-[1.02] text-ivory sm:text-5xl lg:text-6xl">
                  Start with clarity.
                </h2>
                <p className="mt-8 max-w-md text-base leading-relaxed text-ivory/70 sm:text-lg">
                  Schedule a consultation to understand what your family has, what is missing, and what needs attention next.
                </p>
                <div className="mt-10">
                  <PrimaryButton>Schedule a Consultation</PrimaryButton>
                </div>
                <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-ivory/35">
                  Or send us a message below &rarr;
                </p>
              </div>

              {/* Right: contact form */}
              <div className="lg:pt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-ivory/10 bg-espresso-deep">
        <div className="mx-auto max-w-[78rem] px-6 py-12 lg:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-2.5 text-ivory">
              {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://imgur.com/hkTt23u.png" alt="Acorn Care" className="h-8 w-8 object-contain" />
              <span className="font-serif text-lg">Acorn Care</span>
            </div>
            <p className="max-w-xl text-xs leading-relaxed text-ivory/45">
              Acorn Care LLC provides organization, coordination, and preparation support. We do not provide legal, tax,
              medical, insurance, or investment advice. Those decisions remain with the appropriate licensed professionals.
            </p>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <p className="text-xs text-ivory/45">© {new Date().getFullYear()} Acorn Care LLC. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-[11px] text-ivory/35 transition hover:text-ivory/70">Terms of Service</a>
                <Link href="/privacy" className="text-[11px] text-ivory/35 transition hover:text-ivory/70">Privacy Policy</Link>
              </div>
              <p className="text-[11px] text-ivory/30">
                Website powered by{' '}
                <a href="https://www.layer3labs.io/" target="_blank" rel="noopener noreferrer" className="transition hover:text-ivory/60">Layer3</a>
              </p>
            </div>
          </div>
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
      target="_blank"
      rel="noopener noreferrer"
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

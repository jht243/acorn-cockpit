import type { Metadata } from "next";
import Link from "next/link";
import MobileNav from "../../components/MobileNav";

export const metadata: Metadata = {
  title: "Our Story — Acorn Care",
  description:
    "Built from personal caregiving experience and two decades inside wealth management. The story behind Acorn Care and its founder, Karli Vazquez-Mendez.",
};

const CONSULTATION_HREF = "https://calendly.com/karli-acorn-care/30min";

const CREDENTIALS = [
  {
    n: "01",
    title: "Top-Tier Institutions",
    body: "Over two decades of experience at Merrill Lynch, Citi Private Bank, Morgan Stanley, and Raymond James.",
  },
  {
    n: "02",
    title: "Complex Navigations",
    body: "Experience managing a $1.3 billion portfolio, proving she can handle the most complex family estates and asset maps.",
  },
  {
    n: "03",
    title: "The Realization",
    body: "She left traditional wealth management to build Acorn Care because she realized families didn't just need another advisor — they needed an organizer.",
  },
];

const OUTSIDE = [
  {
    label: "A Musician",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    body: "Music has been a constant companion through every chapter. Karli plays and writes as a way to process what words can't always hold.",
  },
  {
    label: "An Advocate",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    body: "From caregiving to client work, advocacy isn't separate from the job — it is the job. She shows up for families the way she wished someone had shown up for hers.",
  },
  {
    label: "A Gator",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 10c-1-4-4-6-8-6S4 6 2 10" />
        <path d="M2 14c1 4 4 6 8 6s7-2 8-6" />
        <path d="M6 12h12" />
        <circle cx="9" cy="12" r="1" fill="currentColor" />
        <circle cx="15" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
    body: "University of Florida alumna. Proud supporter of everything orange and blue — even when it's painful.",
  },
  {
    label: "A Dog Mom",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2 .336-3.5 2.112-3.5 4 0 .828.36 1.571.917 2.083" />
        <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2 .336 3.5 2.112 3.5 4 0 .828-.36 1.571-.917 2.083" />
        <path d="M8 14v.5" />
        <path d="M16 14v.5" />
        <path d="M11.25 16.25h1.5L12 17l-.75-.75z" />
        <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.13-.162-2.2-.435-3.203" />
      </svg>
    ),
    body: "Her dogs are non-negotiable. They show up to video calls, have strong opinions about office hours, and never complain about the paperwork.",
  },
];

export default function OurStory() {
  return (
    <div className="home-page min-h-screen bg-ivory text-charcoal antialiased">

      {/* ── NAV ── */}
      <header className="sticky top-0 z-40 border-b border-ivory/10 bg-espresso-deep shadow-lg shadow-charcoal/10 backdrop-blur-md">
        <nav className="relative mx-auto flex max-w-[78rem] items-center justify-between px-6 py-5 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5 text-ivory">
            {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://imgur.com/hkTt23u.png" alt="Acorn Care" className="h-8 w-8 object-contain" />
            <span className="font-serif text-lg tracking-tight">Acorn Care</span>
          </Link>
          <div className="hidden items-center gap-10 lg:flex">
            {[
              ["Who We Help", "/#who"],
              ["What We Organize", "/#organize"],
              ["How It Works", "/#process"],
              ["Our Story", "/our-story"],
              ["Packages", "/#packages"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={`text-[13px] transition hover:text-ivory ${label === "Our Story" ? "text-ivory" : "text-ivory/65"}`}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <a href={CONSULTATION_HREF} className="hidden text-[13px] tracking-wide text-gold transition hover:text-ivory sm:inline">
              Schedule a consultation &rarr;
            </a>
            <MobileNav />
          </div>
        </nav>
      </header>

      <main>

        {/* ── SECTION 1: HERO ── */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(201,164,106,0.28),transparent_32%),linear-gradient(135deg,rgba(45,73,53,0.96),rgba(26,49,34,0.92)),linear-gradient(90deg,rgba(250,247,241,0.08)_1px,transparent_1px),linear-gradient(rgba(250,247,241,0.08)_1px,transparent_1px)] bg-[length:auto,auto,64px_64px,64px_64px]" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-espresso-deep/50 to-transparent" />

          <div className="mx-auto max-w-[78rem] px-6 pb-28 pt-24 lg:px-10 lg:pb-36 lg:pt-36">
            <div className="max-w-4xl">
              <div className="h-px w-20 bg-gradient-to-r from-gold/90 via-gold to-gold/50" />
              <h1 className="mt-10 font-serif text-[2.4rem] leading-[1.04] text-ivory sm:text-[3.4rem] lg:text-[4.5rem]">
                The story behind<br className="hidden sm:block" />
                <span className="text-ivory/75"> Acorn Care.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-ivory/70 sm:text-lg lg:text-xl">
                Built from personal experience and professional insight to guide families with clarity when it matters most.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: THE CATALYST ── */}
        <section className="border-t border-charcoal/10 bg-ivory">
          <div className="mx-auto max-w-[78rem] px-6 py-28 lg:px-10 lg:py-36">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-24">

              {/* Left: placeholder image */}
              <div className="min-h-[20rem] overflow-hidden border border-charcoal/10 sm:min-h-[28rem] lg:min-h-[auto]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/karli-story.jpeg"
                  alt="Karli Vazquez-Mendez, Founder of Acorn Care"
                  className="h-full w-full object-cover object-top"
                  style={{ minHeight: 'inherit' }}
                />
              </div>

              {/* Right: text */}
              <div className="flex flex-col justify-center">
                <span className="inline-flex items-center gap-3 text-[10.5px] font-medium uppercase tracking-[0.28em] text-gold">
                  <span className="h-px w-6 bg-current opacity-60" />
                  The beginning
                </span>
                <h2 className="mt-6 font-serif text-3xl leading-[1.08] text-espresso-deep sm:text-[2.4rem] lg:text-[3rem]">
                  Rooted in experience.
                </h2>
                <p className="mt-8 text-base leading-relaxed text-charcoal/70 sm:text-lg">
                  Acorn Care was born from both personal reality and professional insight. After spending eight years as the sole caregiver for her mother — while simultaneously building a demanding career in wealth management — our founder, Karli Vazquez-Mendez, saw exactly where the financial and legal systems fail families during life's hardest transitions.
                </p>
                <p className="mt-6 text-base leading-relaxed text-charcoal/70 sm:text-lg">
                  Inspired by her mother's legacy as a Hospice Social Worker, Karli built the exact service she wished she had: a dedicated coordinator to ensure nothing falls through the cracks.
                </p>
                <div className="mt-10 flex items-center gap-4">
                  <div className="h-px w-12 bg-acorn/50" />
                  <span className="font-serif text-base text-espresso-deep">Karli Vazquez-Mendez, Founder</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── SECTION 3: CREDIBILITY ── */}
        <section className="border-t border-charcoal/10">
          <div className="mx-auto max-w-[78rem] px-6 py-28 lg:px-10 lg:py-36">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
              <div>
                <span className="inline-flex items-center gap-3 text-[10.5px] font-medium uppercase tracking-[0.28em] text-gold">
                  <span className="h-px w-6 bg-current opacity-60" />
                  The background
                </span>
                <h2 className="mt-6 font-serif text-3xl leading-[1.08] text-charcoal sm:text-[2.4rem] lg:text-[3rem]">
                  20 years inside the financial system.
                </h2>
              </div>
              <p className="text-base leading-relaxed text-charcoal/65 sm:text-lg lg:pt-3">
                Karli spent two decades navigating the complexities of wealth management, capital markets, and lending. Because she knows exactly how these systems work, she knows exactly how to coordinate them.
              </p>
            </div>

            <ol className="mt-20 divide-y divide-charcoal/10 border-y border-charcoal/10">
              {CREDENTIALS.map((item) => (
                <li
                  key={item.n}
                  className="grid gap-6 py-12 sm:grid-cols-[6rem_1fr_2fr] sm:gap-12 sm:py-14"
                >
                  <div className="font-serif text-3xl text-gold sm:text-4xl">{item.n}</div>
                  <h3 className="font-serif text-2xl leading-tight text-charcoal sm:text-[2rem]">{item.title}</h3>
                  <p className="max-w-xl text-base leading-relaxed text-charcoal/65 sm:text-lg">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── SECTION 4: THE HUMAN ELEMENT ── */}
        <section className="border-t border-charcoal/10 bg-cream text-charcoal">
          <div className="mx-auto max-w-[78rem] px-6 py-28 lg:px-10 lg:py-36">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
              <div>
                <span className="inline-flex items-center gap-3 text-[10.5px] font-medium uppercase tracking-[0.28em] text-gold">
                  <span className="h-px w-6 bg-current opacity-60" />
                  The person
                </span>
                <h2 className="mt-6 font-serif text-3xl leading-[1.08] text-espresso-deep sm:text-[2.4rem] lg:text-[3rem]">
                  Outside the Binder.
                </h2>
                <p className="mt-6 max-w-sm text-base leading-relaxed text-charcoal/60 sm:text-lg">
                  The work is serious. The person behind it doesn't have to be.
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                {OUTSIDE.map((item) => (
                  <div key={item.label} className="border-t border-charcoal/15 pt-6">
                    <div className="flex items-center gap-3 text-acorn">
                      {item.icon}
                      <span className="font-serif text-xl text-espresso-deep">{item.label}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-charcoal/60 sm:text-[15px]">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: CTA ── */}
        <section className="relative overflow-hidden border-t border-ivory/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,164,106,0.35),transparent_24%),linear-gradient(145deg,rgba(45,73,53,0.94),rgba(26,49,34,0.92))]" />
          <div className="relative mx-auto max-w-3xl px-6 py-32 text-center lg:py-40">
            <h2 className="mx-auto mt-8 font-serif text-4xl leading-[1.02] text-ivory sm:text-5xl lg:text-6xl">
              Ready to get organized?
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-ivory/70 sm:text-lg">
              Every engagement starts with a private conversation. No paperwork required to begin.
            </p>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
              <a
                href={CONSULTATION_HREF}
                className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3.5 text-sm font-medium tracking-wide text-espresso-deep transition hover:brightness-95"
              >
                Schedule a Consultation
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm tracking-wide text-ivory/65 transition hover:text-ivory"
              >
                Back to home <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
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
                <a href="#" className="text-[11px] text-ivory/35 transition hover:text-ivory/70">Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

/* ── Shared UI helpers (mirroring app/page.tsx) ── */

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

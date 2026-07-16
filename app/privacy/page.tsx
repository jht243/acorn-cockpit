import type { Metadata } from "next";
import Link from "next/link";
import MobileNav from "../../components/MobileNav";

export const metadata: Metadata = {
  title: "Privacy Policy — Acorn Care",
  description: "How Acorn Care collects, uses, stores, protects, and shares your information.",
};

const CONSULTATION_HREF = "https://calendly.com/karli-acorn-care/30min";

export default function PrivacyPolicy() {
  return (
    <div className="home-page min-h-screen bg-ivory text-charcoal antialiased">

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-ivory/10 bg-espresso-deep shadow-lg shadow-charcoal/10 backdrop-blur-md">
        <nav className="relative mx-auto flex max-w-[78rem] items-center justify-between px-6 py-5 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5 text-ivory">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://imgur.com/hkTt23u.png" alt="Acorn Care" className="h-8 w-8 object-contain" />
            <span className="font-serif text-lg tracking-tight">Acorn Care</span>
          </Link>
          <div className="hidden items-center gap-10 lg:flex">
            {[
              ["What We Organize", "/#organize"],
              ["How It Works", "/#process"],
              ["Our Story", "/our-story"],
              ["Packages", "/#packages"],
              ["Start Intake", "/intake"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="text-[13px] text-ivory/65 transition hover:text-ivory">
                {label}
              </Link>
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
        {/* HERO */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(201,164,106,0.28),transparent_32%),linear-gradient(135deg,rgba(45,73,53,0.96),rgba(26,49,34,0.92))]" />
          <div className="mx-auto max-w-[78rem] px-6 pb-20 pt-24 lg:px-10 lg:pb-28 lg:pt-32">
            <div className="max-w-3xl">
              <div className="h-px w-20 bg-gradient-to-r from-gold/90 via-gold to-gold/50" />
              <h1 className="mt-8 font-serif text-[2.4rem] leading-[1.04] text-ivory sm:text-[3rem] lg:text-[3.75rem]">
                Privacy Policy
              </h1>
              <p className="mt-4 text-sm uppercase tracking-[0.2em] text-ivory/45">
                Effective Date: July 13, 2026
              </p>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="border-t border-charcoal/10">
          <div className="mx-auto max-w-[54rem] px-6 py-20 lg:px-10 lg:py-28">
            <div className="prose-policy space-y-14">

              <Block>
                <p className="text-lg leading-relaxed text-charcoal/80">
                  At Acorn Care, we believe peace of mind begins with clarity, organization, and trust.
                </p>
                <p className="mt-4 leading-relaxed text-charcoal/70">
                  Our mission is to help individuals and families confidently navigate life&apos;s complexities by serving as their Life Operating System — bringing together important information, trusted professionals, and personalized action plans into one secure, organized place.
                </p>
                <p className="mt-4 leading-relaxed text-charcoal/70">
                  We understand that the information you share with us is deeply personal. Whether you&apos;re planning for retirement, organizing your estate, caring for aging parents, preparing for a move, or simply creating order in your financial life, we recognize that privacy is not just a legal obligation — it&apos;s the foundation of our relationship with you.
                </p>
                <p className="mt-4 leading-relaxed text-charcoal/70">
                  This Privacy Policy explains how Acorn Care (&ldquo;Acorn Care,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) collects, uses, stores, protects, and shares your information when you visit www.acorn-care.com, create an account, use our Life Command Center, or engage our services.
                </p>
                <p className="mt-4 leading-relaxed text-charcoal/70">
                  By accessing our website or using our services, you acknowledge that you have read and understand this Privacy Policy.
                </p>
              </Block>

              <Divider />

              <Block heading="Our Philosophy: The Acorn Way">
                <p className="leading-relaxed text-charcoal/70">Every client relationship is built around The Acorn Way.</p>
                <div className="mt-8 space-y-8">
                  {[
                    {
                      word: "Aggregate",
                      body: "We help you gather the information that matters most — important documents, financial information, insurance policies, estate plans, healthcare directives, family contacts, and the professionals who help guide your life.",
                    },
                    {
                      word: "Organize",
                      body: "We transform scattered information into one secure, organized system that makes your life easier to manage and easier for your loved ones to navigate.",
                    },
                    {
                      word: "Implement",
                      body: "We help coordinate the next steps by keeping projects moving, facilitating communication with trusted professionals you&apos;ve authorized, and helping ensure important tasks don&apos;t fall through the cracks.",
                    },
                  ].map(({ word, body }) => (
                    <div key={word} className="flex gap-6 border-t border-charcoal/10 pt-6">
                      <span className="w-28 shrink-0 font-serif text-lg text-gold">{word}</span>
                      <p className="leading-relaxed text-charcoal/70">{body}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-8 text-sm text-charcoal/50 italic">Your privacy is protected throughout every step of this process.</p>
              </Block>

              <Divider />

              <Block heading="Information We Collect">
                <p className="leading-relaxed text-charcoal/70">Depending on the services you request, we may collect information you voluntarily provide, including:</p>
                <ul className="mt-6 space-y-2">
                  {[
                    "Name", "Email address", "Phone number", "Mailing address",
                    "Family information", "Emergency contacts", "Professional advisor information",
                    "Estate planning information", "Insurance information", "Property information",
                    "Retirement planning information", "Healthcare directives", "Personal planning information",
                    "Secure documents uploaded through your Life Command Center",
                    "Other information you choose to share to help us provide our services",
                  ].map((item) => (
                    <li key={item} className="flex items-baseline gap-3 text-charcoal/70">
                      <span className="mt-2 h-px w-4 flex-none bg-gold/60" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-charcoal/50 italic">You decide what information to share with Acorn Care.</p>
              </Block>

              <Divider />

              <Block heading="Your Life Command Center">
                <p className="leading-relaxed text-charcoal/70">
                  As part of our services, Acorn Care may provide you with access to a secure Life Command Center and document vault — a centralized location where you can:
                </p>
                <ul className="mt-6 space-y-2">
                  {[
                    "Securely upload important documents",
                    "Store wills, trusts, powers of attorney, and healthcare directives",
                    "Maintain insurance policies and account summaries",
                    "Track important tasks and deadlines",
                    "View personalized action plans",
                    "Organize household and property information",
                    "Maintain a directory of trusted advisors",
                    "Access important family information",
                    "Exchange secure communications with Acorn Care",
                  ].map((item) => (
                    <li key={item} className="flex items-baseline gap-3 text-charcoal/70">
                      <span className="mt-2 h-px w-4 flex-none bg-gold/60" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 leading-relaxed text-charcoal/70">
                  Clients are responsible for maintaining the confidentiality of their usernames and passwords and should notify us immediately if they suspect unauthorized access to their account.
                </p>
              </Block>

              <Divider />

              <Block heading="How We Use Your Information">
                <p className="leading-relaxed text-charcoal/70">We use your information to:</p>
                <ul className="mt-6 space-y-2">
                  {[
                    "Deliver the services you request",
                    "Build and maintain your personalized Life Operating System",
                    "Coordinate with trusted professionals you authorize",
                    "Organize and maintain your secure document vault",
                    "Schedule meetings and consultations",
                    "Develop personalized action plans and checklists",
                    "Communicate regarding your account and services",
                    "Improve our website, Life Command Center, and client experience",
                    "Process payments",
                    "Comply with legal obligations",
                    "Protect the security of our systems",
                  ].map((item) => (
                    <li key={item} className="flex items-baseline gap-3 text-charcoal/70">
                      <span className="mt-2 h-px w-4 flex-none bg-gold/60" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-charcoal/50 italic">We use only the information reasonably necessary to provide the services you&apos;ve requested.</p>
              </Block>

              <Divider />

              <Block heading="Coordination With Trusted Professionals">
                <p className="leading-relaxed text-charcoal/70">
                  Acorn Care exists to simplify communication and coordination. With your authorization, we may communicate with professionals involved in your planning, including attorneys, accountants, financial advisors, insurance professionals, healthcare providers, real estate professionals, and other individuals you designate.
                </p>
                <p className="mt-4 leading-relaxed text-charcoal/70">
                  Acorn Care coordinates information — we do not replace the independent advice or professional judgment of your licensed advisors.
                </p>
              </Block>

              <Divider />

              <Block heading="Artificial Intelligence &amp; Technology">
                <p className="leading-relaxed text-charcoal/70">
                  To improve efficiency and enhance your experience, Acorn Care may use technology-assisted tools, including automation and artificial intelligence, to organize information, summarize documents, generate reminders, or assist with administrative tasks.
                </p>
                <p className="mt-4 leading-relaxed text-charcoal/70">
                  These tools are always used under human oversight. They do not replace professional judgment or provide legal, tax, medical, or investment advice.
                </p>
                <p className="mt-4 leading-relaxed text-charcoal/70">
                  Acorn Care will not knowingly use your confidential information to train publicly available artificial intelligence models without your consent.
                </p>
              </Block>

              <Divider />

              <Block heading="Security">
                <p className="leading-relaxed text-charcoal/70">
                  Protecting your information is central to our mission. We maintain commercially reasonable administrative, technical, and physical safeguards designed to protect your information, including secure cloud storage, encrypted data transmission where appropriate, password-protected systems, access controls, and other security practices intended to reduce the risk of unauthorized access.
                </p>
                <p className="mt-4 leading-relaxed text-charcoal/70">
                  While no technology can guarantee absolute security, we continuously strive to protect the information entrusted to us.
                </p>
              </Block>

              <Divider />

              <Block heading="Your Privacy Rights">
                <p className="leading-relaxed text-charcoal/70">Depending on where you reside, you may have rights regarding your personal information, including the right to:</p>
                <ul className="mt-6 space-y-2">
                  {[
                    "Request access to your personal information",
                    "Request corrections to inaccurate information",
                    "Request deletion of certain information",
                    "Withdraw consent where applicable",
                    "Opt out of marketing communications",
                  ].map((item) => (
                    <li key={item} className="flex items-baseline gap-3 text-charcoal/70">
                      <span className="mt-2 h-px w-4 flex-none bg-gold/60" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 leading-relaxed text-charcoal/70">To exercise these rights, please contact us using the information below.</p>
              </Block>

              <Divider />

              <Block heading="Changes to This Privacy Policy">
                <p className="leading-relaxed text-charcoal/70">
                  As Acorn Care grows and our services evolve, we may update this Privacy Policy from time to time. The updated version will be posted on this page with a revised Effective Date. Your continued use of our website or services after changes become effective constitutes acceptance of the updated Privacy Policy.
                </p>
              </Block>

              <Divider />

              <Block heading="Contact Us">
                <p className="leading-relaxed text-charcoal/70">If you have questions about this Privacy Policy or our privacy practices, please contact us.</p>
                <div className="mt-6 space-y-2 text-charcoal/70">
                  <p><span className="font-medium text-charcoal">Acorn Care</span></p>
                  <p>Website: <a href="https://www.acorn-care.com" className="text-espresso-deep underline underline-offset-2 hover:text-charcoal">www.acorn-care.com</a></p>
                  <p>Email: <a href="mailto:info@acorn-care.com" className="text-espresso-deep underline underline-offset-2 hover:text-charcoal">info@acorn-care.com</a></p>
                </div>
              </Block>

              <Divider />

              <Block heading="Our Commitment">
                <p className="leading-relaxed text-charcoal/70">
                  At Acorn Care, we&apos;re honored to help safeguard what matters most. Your information represents your family, your future, your plans, and your legacy. We are committed to treating it with the same level of care, discretion, and professionalism that we would expect for our own families.
                </p>
                <p className="mt-6 font-serif text-lg text-espresso-deep">That&apos;s The Acorn Way.</p>
              </Block>

            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-ivory/10 bg-espresso-deep">
        <div className="mx-auto max-w-[78rem] px-6 py-12 lg:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-2.5 text-ivory">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://imgur.com/hkTt23u.png" alt="Acorn Care" className="h-8 w-8 object-contain" />
              <span className="font-serif text-lg">Acorn Care</span>
            </div>
            <p className="max-w-xl text-xs leading-relaxed text-ivory/45">
              Acorn Care LLC provides organization, coordination, and preparation support. We do not provide legal, tax, medical, insurance, or investment advice. Those decisions remain with the appropriate licensed professionals.
            </p>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <p className="text-xs text-ivory/45">© {new Date().getFullYear()} Acorn Care LLC. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-[11px] text-ivory/35 transition hover:text-ivory/70">Terms of Service</a>
                <Link href="/privacy" className="text-[11px] text-ivory/35 transition hover:text-ivory/70">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

function Block({ heading, children }: { heading?: string; children: React.ReactNode }) {
  return (
    <div>
      {heading && (
        <h2 className="mb-6 font-serif text-2xl text-espresso-deep sm:text-3xl">{heading}</h2>
      )}
      {children}
    </div>
  );
}

function Divider() {
  return <div className="border-t border-charcoal/10" />;
}

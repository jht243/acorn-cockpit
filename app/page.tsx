import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <header className="bg-white border-b py-4 px-6 flex items-center justify-between" style={{ borderColor: "var(--line)" }}>
        <div className="flex items-center gap-3">
          <Logo />
          <div className="text-lg font-semibold tracking-tight">Acorn Care</div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:underline" style={{ color: "var(--ink-soft)" }}>Client Login</Link>
          <Link href="/admin-login" className="text-sm font-medium hover:underline" style={{ color: "var(--ink-soft)" }}>Advisor Login</Link>
          <a href="https://calendly.com/placeholder" className="btn">Book Intro Call</a>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold tracking-tight mb-6" style={{ color: "var(--ink)" }}>
            Concierge Financial Planning for Your Family's Future
          </h1>
          <p className="text-lg mb-10" style={{ color: "var(--ink-soft)" }}>
            We provide comprehensive wealth management, estate planning coordination, and proactive tax strategies. Choose the level of care that fits your life.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
            <div className="card card-pad flex flex-col">
              <div className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: "var(--ink-soft)" }}>Royal Oak</div>
              <p className="text-sm flex-1" style={{ color: "var(--ink-soft)" }}>Essential financial planning and investment management for individuals and families building wealth.</p>
            </div>
            <div className="card card-pad flex flex-col border-2" style={{ borderColor: "var(--brand)" }}>
              <div className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: "var(--brand)" }}>Sycamore</div>
              <p className="text-sm flex-1" style={{ color: "var(--ink-soft)" }}>Advanced tax strategies, estate planning coordination, and comprehensive wealth management.</p>
            </div>
            <div className="card card-pad flex flex-col">
              <div className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: "var(--ink-soft)" }}>Mahogany</div>
              <p className="text-sm flex-1" style={{ color: "var(--ink-soft)" }}>White-glove family office services for complex estates, business owners, and multi-generational wealth.</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <a href="https://calendly.com/placeholder" className="btn px-6 py-3 text-base">Schedule a Free Consultation</a>
            <Link href="/intake" className="btn-ghost btn px-6 py-3 text-base">Start Secure Intake</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 6c-2 0-3 1-3 2v2h6V8c0-1-1-2-3-2z" fill="#c08a3e"/>
      <path d="M9 12h14c0 6-3 12-7 12s-7-6-7-12z" fill="#2f7d4f"/>
    </svg>
  );
}

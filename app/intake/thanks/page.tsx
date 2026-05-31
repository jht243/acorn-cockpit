import Link from "next/link";

export default function Thanks() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <div className="card card-pad max-w-md w-full text-center mx-4 py-10">
        <div className="w-14 h-14 rounded-full bg-[var(--brand-soft)] mx-auto flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
        </div>
        <h2 className="text-xl font-semibold tracking-tight mb-1">You're all set.</h2>
        <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>
          Karli will review your intake and reach out within 1 business day to schedule your 2-hour plan review.
        </p>
        <Link href="/" className="btn">Back to dashboard (demo)</Link>
        <div className="text-xs mt-4" style={{ color: "var(--ink-soft)" }}>
          Acorn Care, LLC — Concierge Financial Planning
        </div>
      </div>
    </div>
  );
}

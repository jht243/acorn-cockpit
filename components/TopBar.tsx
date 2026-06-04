"use client";
import Link from "next/link";
import InviteClientButton from "./InviteClientButton";

export default function TopBar({ title, breadcrumb }: { title: string; breadcrumb?: { label: string; href?: string }[] }) {
  return (
    <header className="h-[60px] bg-white border-b flex items-center justify-between px-6" style={{ borderColor: "var(--line)" }}>
      <div className="flex items-center gap-3">
        <h1 className="text-[15px] font-semibold tracking-tight">{title}</h1>
        {breadcrumb && (
          <nav className="flex items-center gap-2 text-sm" style={{ color: "var(--ink-soft)" }}>
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                <span>/</span>
                {b.href ? <Link href={b.href} className="hover:underline">{b.label}</Link> : <span>{b.label}</span>}
              </span>
            ))}
          </nav>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button className="btn-ghost btn" title="Search"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg> Search</button>
        <InviteClientButton
          trigger={
            <button className="btn-ghost btn" title="Add a new client">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              Quick add
            </button>
          }
        />
        <div className="flex items-center gap-2 pl-3 border-l" style={{ borderColor: "var(--line)" }}>
          <div className="w-8 h-8 rounded-full bg-[var(--brand)] flex items-center justify-center text-white text-sm font-semibold">KV</div>
          <div className="text-sm">
            <div className="font-medium leading-tight">Karli Vazquez-Mendez</div>
            <div className="text-xs" style={{ color: "var(--ink-soft)" }}>Acorn Care, LLC</div>
          </div>
        </div>
      </div>
    </header>
  );
}

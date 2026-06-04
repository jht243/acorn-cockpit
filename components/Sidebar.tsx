"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Cockpit", icon: HomeIcon },
  { href: "/dashboard/clients", label: "Clients", icon: UsersIcon },
  { href: "/dashboard/documents", label: "Documents", icon: DocIcon },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-[64px] shrink-0 flex flex-col justify-between" style={{ background: "var(--sidebar)" }}>
      <div>
        <div className="h-[60px] flex items-center justify-center text-white" title="Acorn Care">
          <AcornLogo />
        </div>
        <nav className="flex flex-col items-center mt-2">
          {items.map((it) => {
            const Active = path === it.href || (it.href !== "/dashboard" && path.startsWith(it.href));
            return (
              <Link key={it.href} href={it.href} className={`sidebar-link group ${Active ? "active" : ""}`}>
                <it.icon />
                <span className="sidebar-tooltip">{it.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-col items-center pb-4 text-white/40">
        <Link href="/dashboard/settings" className="sidebar-link group">
          <GearIcon />
          <span className="sidebar-tooltip">Settings</span>
        </Link>
      </div>
    </aside>
  );
}

function AcornLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <path d="M16 6c-2 0-3 1-3 2v2h6V8c0-1-1-2-3-2z" fill="#c08a3e"/>
      <path d="M9 12h14c0 6-3 12-7 12s-7-6-7-12z" fill="#2f7d4f"/>
      <circle cx="13" cy="16" r="1" fill="#1f5a39"/>
      <circle cx="18" cy="18" r="1" fill="#1f5a39"/>
    </svg>
  );
}

function HomeIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V11z"/></svg>; }
function UsersIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="8" r="3"/><path d="M3 21c0-3 3-5 6-5s6 2 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M15 14c3 0 6 1.5 6 4"/></svg>; }
function FormIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>; }
function CalIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>; }
function DocIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>; }
function MailIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/></svg>; }
function GearIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>; }

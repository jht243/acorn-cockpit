"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AddClientButton from "./AddClientButton";
import InviteClientButton from "./InviteClientButton";
import { createClient } from "@/utils/supabase/client";

export default function TopBar({ title, breadcrumb }: { title: string; breadcrumb?: { label: string; href?: string }[] }) {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (searching) inputRef.current?.focus();
  }, [searching]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/dashboard?q=${encodeURIComponent(query.trim())}`);
      setSearching(false);
      setQuery("");
    }
  };

  const closeSearch = () => { setSearching(false); setQuery(""); };

  return (
    <header className="h-[60px] bg-white border-b flex items-center justify-between gap-2 px-3 sm:px-6" style={{ borderColor: "var(--line)" }}>
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {!searching && (
          <>
            <h1 className="text-[15px] font-semibold tracking-tight truncate">{title}</h1>
            {breadcrumb && (
              <nav className="hidden lg:flex items-center gap-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                {breadcrumb.map((b, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span>/</span>
                    {b.href ? <Link href={b.href} className="hover:underline">{b.label}</Link> : <span>{b.label}</span>}
                  </span>
                ))}
              </nav>
            )}
          </>
        )}
        {searching && (
          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="2" className="shrink-0"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search clients…"
              className="text-sm outline-none bg-transparent flex-1 min-w-0"
              onKeyDown={(e) => e.key === "Escape" && closeSearch()}
            />
            <button type="button" onClick={closeSearch} className="text-xs px-2 py-1 rounded hover:bg-gray-100 shrink-0" style={{ color: "var(--ink-soft)" }}>✕</button>
          </form>
        )}
      </div>

      {!searching && (
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <button
          className="btn-ghost btn !px-2 sm:!px-3.5"
          onClick={() => setSearching(true)}
          title="Search clients"
          aria-label="Search clients"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <span className="hidden sm:inline">Search</span>
        </button>
        <InviteClientButton label="Send intake" className="btn-ghost btn hidden sm:inline-flex" />
        <AddClientButton />
        <div className="flex items-center gap-2 sm:pl-3 sm:border-l" style={{ borderColor: "var(--line)" }}>
          <div className="w-8 h-8 rounded-full bg-[var(--brand)] flex items-center justify-center text-white text-sm font-semibold shrink-0">KV</div>
          <div className="text-sm hidden md:block">
            <div className="font-medium leading-tight">Karli Vazquez-Mendez</div>
            <div className="text-xs" style={{ color: "var(--ink-soft)" }}>Acorn Care, LLC</div>
          </div>
          <button
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className="ml-2 text-xs px-2 py-1 rounded hover:bg-gray-100"
            style={{ color: "var(--ink-soft)" }}
            title="Sign out"
          >
            Sign out
          </button>
        </div>
      </div>
      )}
    </header>
  );
}

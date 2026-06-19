"use client";
import { useState } from "react";

const SHARED_FILES = [
  { id: "1", name: "2023 Tax Return.pdf", tag: "Tax", size: "1.2 MB", pages: 24 },
  { id: "2", name: "IRA Statement Q4.pdf", tag: "Statements", size: "840 KB", pages: 8 },
];

const TAG_COLORS: Record<string, { bg: string; fg: string }> = {
  Tax: { bg: "#fff7e6", fg: "#b45309" },
  Statements: { bg: "#e8f0fe", fg: "#1a73e8" },
  Estate: { bg: "#f4faf5", fg: "#1f5a39" },
  Insurance: { bg: "#fce8e6", fg: "#c5221f" },
};

export default function ShareMockup() {
  const [unlocked, setUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState(false);
  const [previewing, setPreviewing] = useState<string | null>(null);

  const MOCK_PASSWORD = "Acorn2025";

  const tryUnlock = () => {
    if (passwordInput === MOCK_PASSWORD) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setPasswordInput("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header className="bg-white border-b py-4 px-6 flex items-center justify-between" style={{ borderColor: "var(--line)" }}>
        <div className="flex items-center gap-2">
          <Logo />
          <div>
            <div className="text-sm font-semibold">Acorn Care</div>
          </div>
        </div>
        <div className="text-xs flex items-center gap-1.5" style={{ color: "var(--ink-soft)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Secure · encrypted in transit · expires Feb 7, 2025
        </div>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-lg space-y-4">

          {/* Mockup notice */}
          <div className="px-4 py-2.5 rounded-md border text-sm flex items-center gap-2" style={{ borderColor: "#c08a3e", background: "#fffbf0", color: "#92400e" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <strong>Mockup only.</strong> Password is <code className="bg-amber-100 px-1 rounded font-mono">Acorn2025</code>
          </div>

          {!unlocked ? (
            /* ── Password gate ── */
            <div className="card card-pad">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[var(--brand-soft)] mx-auto flex items-center justify-center mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <h2 className="text-lg font-semibold tracking-tight">Shared documents</h2>
                <p className="text-sm mt-1" style={{ color: "var(--ink-soft)" }}>
                  Shared by <strong>Karli Vazquez-Mendez</strong> · Acorn Care
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="label">Enter the password to access these files</label>
                  <input
                    className={`input w-full ${error ? "border-red-400" : ""}`}
                    type="password"
                    placeholder="Password"
                    value={passwordInput}
                    onChange={(e) => { setPasswordInput(e.target.value); setError(false); }}
                    onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
                    autoFocus
                  />
                  {error && (
                    <p className="text-xs mt-1.5 text-red-600">Incorrect password. Please check with Karli and try again.</p>
                  )}
                </div>
                <button className="btn w-full justify-center" onClick={tryUnlock}>
                  Access files →
                </button>
              </div>

              <div className="mt-5 pt-4 border-t text-xs text-center space-y-1" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>
                <p>This link was sent to you by Karli Vazquez-Mendez at Acorn Care, LLC.</p>
                <p>If you weren't expecting this, please disregard or contact <a href="mailto:karli@acorncare.com" className="hover:underline" style={{ color: "var(--brand)" }}>karli@acorncare.com</a></p>
              </div>
            </div>
          ) : (
            /* ── Unlocked: file viewer ── */
            <>
              <div className="card card-pad">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--brand-soft)] flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Access granted</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>
                      Shared by <strong>Karli Vazquez-Mendez</strong> · Acorn Care ·
                      {" "}<span style={{ color: "var(--brand)" }}>Expires Feb 7, 2025</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <div className="flex flex-col gap-0.5">
                    <span>{SHARED_FILES.length} files shared with you</span>
                    <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>
                      Re: Anita Reyes · for Eduardo Marin, CPA
                    </span>
                  </div>
                </div>
                <ul>
                  {SHARED_FILES.map((f) => {
                    const tag = TAG_COLORS[f.tag] ?? { bg: "#f0f0f0", fg: "#555" };
                    return (
                      <li key={f.id} className="px-5 py-4 border-t" style={{ borderColor: "var(--line)" }}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded flex items-center justify-center text-xs font-bold shrink-0" style={{ background: tag.bg, color: tag.fg }}>
                            {f.tag.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">{f.name}</div>
                            <div className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>
                              <span style={{ background: tag.bg, color: tag.fg, padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 600 }}>{f.tag}</span>
                              {" · "}{f.size}{" · "}{f.pages} pages
                            </div>
                          </div>
                          <button
                            className="btn text-xs shrink-0"
                            onClick={() => setPreviewing(previewing === f.id ? null : f.id)}
                          >
                            {previewing === f.id ? "Close" : "View"}
                          </button>
                        </div>

                        {/* Inline PDF preview placeholder */}
                        {previewing === f.id && (
                          <div className="mt-3 rounded-md border overflow-hidden" style={{ borderColor: "var(--line)" }}>
                            <div className="flex items-center justify-between px-3 py-2 border-b text-xs" style={{ borderColor: "var(--line)", background: "#f9fbfa" }}>
                              <span className="font-medium">{f.name}</span>
                              <div className="flex gap-3" style={{ color: "var(--ink-soft)" }}>
                                <span>Page 1 of {f.pages}</span>
                                <span>·</span>
                                <span>View only</span>
                              </div>
                            </div>
                            {/* Mock PDF canvas */}
                            <div className="bg-gray-100 flex items-center justify-center" style={{ height: 320 }}>
                              <div className="text-center" style={{ color: "var(--ink-soft)" }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-2 opacity-40"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M13 2v7h7"/></svg>
                                <div className="text-sm">PDF viewer would render here</div>
                                <div className="text-xs mt-1 opacity-60">Inline preview via PDF.js or similar</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="text-center text-xs pb-4 space-y-2" style={{ color: "var(--ink-soft)" }}>
                <p>These files are confidential. Do not forward this link.</p>
                <p>Questions? Contact <a href="mailto:karli@acorncare.com" className="hover:underline" style={{ color: "var(--brand)" }}>karli@acorncare.com</a></p>
              </div>
            </>
          )}
        </div>
      </div>
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

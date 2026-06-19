"use client";
import { useState } from "react";

type UploadedFile = { name: string; size: string; tag: string };

const DOC_CATEGORIES = [
  { cat: "Tax", items: ["Most recent tax return (Form 1040)", "K-1s, 1099s, W-2s"] },
  { cat: "Statements", items: ["Investment & brokerage statements", "Retirement account statements (IRA, 401k)"] },
  { cat: "Estate", items: ["Will / trust documents", "Power of attorney"] },
  { cat: "Insurance", items: ["Life insurance declarations", "Long-term care policy"] },
  { cat: "Lending", items: ["Mortgage / loan statements"] },
  { cat: "Income", items: ["Most recent pay stub", "Business P&L (if applicable)"] },
];

export default function UploadMockup() {
  const [uploaded, setUploaded] = useState<UploadedFile[]>([
    { name: "2023_Tax_Return.pdf", size: "1.2 MB", tag: "Tax" },
    { name: "IRA_Statement_Q4.pdf", size: "840 KB", tag: "Statements" },
  ]);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedTag, setSelectedTag] = useState("Tax");

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="card card-pad max-w-md w-full text-center mx-4 py-10">
          <div className="w-14 h-14 rounded-full bg-[var(--brand-soft)] mx-auto flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
          </div>
          <h2 className="text-xl font-semibold tracking-tight mb-2">Documents received.</h2>
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            Karli will review what you've uploaded and follow up if anything else is needed.
          </p>
          <div className="text-xs mt-6" style={{ color: "var(--ink-soft)" }}>Acorn Care, LLC</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header className="bg-white border-b py-4 px-6 flex items-center justify-between" style={{ borderColor: "var(--line)" }}>
        <div className="flex items-center gap-2">
          <Logo />
          <div>
            <div className="text-sm font-semibold">Acorn Care</div>
          </div>
        </div>
        <div className="text-xs" style={{ color: "var(--ink-soft)" }}>Secure upload · encrypted in transit</div>
      </header>

      {/* Mockup notice */}
      <div className="max-w-2xl mx-auto px-6 pt-4">
        <div className="px-4 py-2.5 rounded-md border text-sm flex items-center gap-2" style={{ borderColor: "#c08a3e", background: "#fffbf0", color: "#92400e" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <strong>Mockup only</strong> — no files are actually uploaded.
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-5">

        {/* Context card */}
        <div className="card card-pad">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--brand-soft)] text-[var(--brand-dark)] flex items-center justify-center font-semibold text-sm shrink-0">AR</div>
            <div>
              <div className="text-sm font-semibold">Anita Reyes — document upload</div>
              <div className="text-xs" style={{ color: "var(--ink-soft)" }}>Requested by Karli Vazquez-Mendez · Acorn Care</div>
            </div>
          </div>
        </div>

        {/* Upload zone */}
        <div className="card">
          <div className="card-pad space-y-4">
            <div>
              <div className="text-sm font-semibold mb-1">Select a category</div>
              <div className="flex flex-wrap gap-2">
                {DOC_CATEGORIES.map(({ cat }) => (
                  <button key={cat} type="button" onClick={() => setSelectedTag(cat)}
                    className={`py-1.5 px-3 rounded-full border text-sm ${selectedTag === cat ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] font-medium" : "border-[var(--line)] bg-white"}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <label
              className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${dragOver ? "bg-[var(--brand-soft)] border-[var(--brand)]" : "hover:bg-white"}`}
              style={{ borderColor: dragOver ? "var(--brand)" : "var(--line)" }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const files = Array.from(e.dataTransfer.files);
                setUploaded((prev) => [
                  ...prev,
                  ...files.map((f) => ({ name: f.name, size: `${(f.size / 1024).toFixed(0)} KB`, tag: selectedTag })),
                ]);
              }}
              onChange={(e: any) => {
                const files = Array.from(e.target.files as FileList);
                setUploaded((prev) => [
                  ...prev,
                  ...files.map((f: any) => ({ name: f.name, size: `${(f.size / 1024).toFixed(0)} KB`, tag: selectedTag })),
                ]);
              }}
            >
              <input type="file" multiple className="hidden" />
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.5" className="mx-auto mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>
              <div className="text-sm font-medium">Click to upload, or drag & drop</div>
              <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>PDF, DOCX, JPG, PNG · up to 25 MB each</div>
            </label>

            <div className="px-3 py-2 rounded-md border text-xs font-medium flex items-center gap-2" style={{ borderColor: "#f5c2c7", background: "#fff5f5", color: "#842029" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Please do not upload medical records.
            </div>
          </div>
        </div>

        {/* Uploaded files */}
        {uploaded.length > 0 && (
          <div className="card">
            <div className="card-head">
              <span>Uploaded ({uploaded.length})</span>
              <span className="text-xs normal-case font-normal" style={{ color: "var(--ink-soft)" }}>ready to submit</span>
            </div>
            <ul>
              {uploaded.map((f, i) => (
                <li key={i} className="px-5 py-3 border-t flex items-center gap-3" style={{ borderColor: "var(--line)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M13 2v7h7"/></svg>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{f.name}</div>
                    <div className="text-xs" style={{ color: "var(--ink-soft)" }}>{f.size} · <span className="font-medium" style={{ color: "var(--brand)" }}>{f.tag}</span></div>
                  </div>
                  <button onClick={() => setUploaded((prev) => prev.filter((_, j) => j !== i))}
                    className="text-xs px-2 py-1 rounded hover:bg-red-50 shrink-0" style={{ color: "var(--danger)" }}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* What to include guide */}
        <div className="card">
          <div className="card-head">
            <span>What to include</span>
            <span className="text-xs normal-case font-normal" style={{ color: "var(--ink-soft)" }}>upload what you have — nothing needs to be complete</span>
          </div>
          <div className="card-pad grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {DOC_CATEGORIES.map(({ cat, items }) => (
              <div key={cat}>
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--brand)" }}>{cat}</div>
                <ul className="space-y-1">
                  {items.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-xs" style={{ color: "var(--ink-soft)" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0"><path d="M9 11l3 3L22 4"/></svg>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
            You can always send more later — Karli will follow up if anything specific is needed.
          </p>
          <button
            className="btn shrink-0"
            disabled={uploaded.length === 0}
            style={uploaded.length === 0 ? { opacity: 0.5, cursor: "not-allowed" } : {}}
            onClick={() => setSubmitted(true)}
          >
            Submit documents →
          </button>
        </div>

        <div className="text-center text-xs pb-4 flex items-center justify-center gap-4" style={{ color: "var(--ink-soft)" }}>
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <span>·</span>
          <a href="/terms" className="hover:underline">Terms</a>
          <span>·</span>
          <a href="mailto:karli@acorncare.com" className="hover:underline">Contact Karli</a>
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

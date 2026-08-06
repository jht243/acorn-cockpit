"use client";
import { useState } from "react";
import Link from "next/link";
import Sidebar from "../../../../components/Sidebar";
import TopBar from "../../../../components/TopBar";

const MOCK_DOCS = [
  { id: "1", name: "2023 Tax Return.pdf", tag: "Tax", uploaded: "Dec 12, 2024", source: "Client intake", size: "1.2 MB" },
  { id: "2", name: "IRA Statement Q4.pdf", tag: "Statements", uploaded: "Dec 12, 2024", source: "Client intake", size: "840 KB" },
  { id: "3", name: "Will (2018).pdf", tag: "Estate", uploaded: "Dec 14, 2024", source: "Client intake", size: "2.1 MB" },
  { id: "4", name: "Brokerage Statement Nov.pdf", tag: "Statements", uploaded: "Jan 5, 2025", source: "Karli upload", size: "560 KB" },
];

const MOCK_LINKS = [
  { id: "l1", files: ["2023 Tax Return.pdf"], sentTo: "Eduardo Marin", role: "CPA / Marin & Co.", created: "Jan 8, 2025", expires: "Feb 7, 2025", daysLeft: 14, active: true },
  { id: "l2", files: ["Will (2018).pdf", "IRA Statement Q4.pdf"], sentTo: "Estate Review Attorney", role: "Goldstein PLLC", created: "Dec 20, 2024", expires: "Jan 19, 2025", daysLeft: 0, active: false },
];

const TAG_COLORS: Record<string, { bg: string; fg: string }> = {
  Tax: { bg: "#fff7e6", fg: "#b45309" },
  Statements: { bg: "#e8f0fe", fg: "#1a73e8" },
  Estate: { bg: "#f4faf5", fg: "#1f5a39" },
  Insurance: { bg: "#fce8e6", fg: "#c5221f" },
  Lending: { bg: "#f1ecfe", fg: "#5b3dbe" },
  Income: { bg: "#f0fdf4", fg: "#15803d" },
};

export default function DocumentsMockup() {
  const [sharePanel, setSharePanel] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [expiry, setExpiry] = useState("30");
  const [permission, setPermission] = useState("view");
  const [sentTo, setSentTo] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleFile = (id: string) =>
    setSelectedFiles((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const generateLink = () => {
    setGeneratedLink("https://acorncare.com/share/a8f2b3c9d4e5f6");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title="Documents"
          breadcrumb={[
            { label: "Clients", href: "/dashboard/clients" },
            { label: "Anita Reyes", href: "/dashboard/clients/anita" },
            { label: "Documents" },
          ]}
        />
        <main className="flex-1 p-4 sm:p-6">
          <div className="max-w-5xl mx-auto space-y-5">

            {/* Mockup notice */}
            <div className="px-4 py-2.5 rounded-md border text-sm flex items-center gap-2" style={{ borderColor: "#c08a3e", background: "#fffbf0", color: "#92400e" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <strong>Mockup only</strong> — buttons and interactions are illustrative. No files are actually stored or shared.
            </div>

            <div className="flex gap-5">
              {/* Left: upload + documents list */}
              <div className="flex-1 min-w-0 space-y-5">

                {/* Upload zone */}
                <div className="card">
                  <div className="card-head">
                    <span>Upload documents</span>
                    <span className="text-xs normal-case font-normal" style={{ color: "var(--ink-soft)" }}>for Anita Reyes</span>
                  </div>
                  <div className="card-pad">
                    <label
                      className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${dragOver ? "bg-[var(--brand-soft)] border-[var(--brand)]" : "hover:bg-white"}`}
                      style={{ borderColor: dragOver ? "var(--brand)" : "var(--line)" }}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
                    >
                      <input type="file" multiple className="hidden" />
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.5" className="mx-auto mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>
                      <div className="text-sm font-medium">Click to upload, or drag & drop</div>
                      <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>PDF, DOCX, JPG, PNG · up to 25 MB each</div>
                    </label>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["Tax", "Statements", "Estate", "Insurance", "Lending", "Income"].map((tag) => (
                        <button key={tag} type="button" className="text-xs px-2.5 py-1 rounded-full border" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>
                          {tag}
                        </button>
                      ))}
                      <span className="text-xs self-center" style={{ color: "var(--ink-soft)" }}>← select a category before uploading</span>
                    </div>
                    <div className="mt-3 px-3 py-2 rounded-md border text-xs font-medium flex items-center gap-2" style={{ borderColor: "#f5c2c7", background: "#fff5f5", color: "#842029" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      Do not upload medical records.
                    </div>
                  </div>
                </div>

                {/* Documents list */}
                <div className="card">
                  <div className="card-head">
                    <div className="flex flex-col gap-0.5">
                      <span>Files ({MOCK_DOCS.length})</span>
                      <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>Stored securely · encrypted at rest</span>
                    </div>
                    {selectedFiles.length > 0 && (
                      <button className="btn text-sm" onClick={() => setSharePanel(true)}>
                        Share {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} →
                      </button>
                    )}
                  </div>
                  <ul>
                    {MOCK_DOCS.map((d) => {
                      const tag = TAG_COLORS[d.tag] ?? { bg: "#f0f0f0", fg: "#555" };
                      const selected = selectedFiles.includes(d.id);
                      return (
                        <li key={d.id} className={`px-5 py-3 border-t flex items-center gap-3 ${selected ? "bg-[var(--brand-soft)]" : ""}`} style={{ borderColor: "var(--line)" }}>
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleFile(d.id)}
                            className="shrink-0"
                          />
                          <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-semibold shrink-0" style={{ background: tag.bg, color: tag.fg }}>
                            {d.tag.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{d.name}</div>
                            <div className="text-xs flex items-center gap-1.5 flex-wrap" style={{ color: "var(--ink-soft)" }}>
                              <span style={{ background: tag.bg, color: tag.fg, padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 600 }}>{d.tag}</span>
                              <span>·</span>
                              <span>{d.uploaded}</span>
                              <span>·</span>
                              <span>{d.size}</span>
                              <span>·</span>
                              <span className="pill pill-gray" style={{ fontSize: 10, padding: "1px 6px" }}>{d.source}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button className="text-xs px-2.5 py-1 rounded border hover:bg-white" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>View</button>
                            <button
                              className="text-xs px-2.5 py-1 rounded border hover:bg-[var(--brand-soft)]"
                              style={{ borderColor: "var(--brand-soft)", color: "var(--brand)" }}
                              onClick={() => { setSelectedFiles([d.id]); setSharePanel(true); }}
                            >
                              Share
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Active share links */}
                <div className="card">
                  <div className="card-head">
                    <div className="flex flex-col gap-0.5">
                      <span>Share links</span>
                      <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>Links you've created for outside professionals</span>
                    </div>
                    <button className="btn-ghost btn text-xs normal-case" onClick={() => setSharePanel(true)}>+ New link</button>
                  </div>
                  <ul>
                    {MOCK_LINKS.map((l) => (
                      <li key={l.id} className="px-5 py-3 border-t flex items-start gap-3" style={{ borderColor: "var(--line)" }}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium">{l.sentTo}</span>
                            <span className="text-xs" style={{ color: "var(--ink-soft)" }}>{l.role}</span>
                            <span className={`pill ${l.active ? "pill-green" : "pill-gray"}`}>{l.active ? "Active" : "Expired"}</span>
                          </div>
                          <div className="text-xs mt-1 flex items-center gap-1.5 flex-wrap" style={{ color: "var(--ink-soft)" }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/></svg>
                            {l.files.join(", ")}
                            <span>·</span>
                            <span>Created {l.created}</span>
                            <span>·</span>
                            <span style={{ color: l.active ? "var(--brand)" : "var(--ink-soft)" }}>
                              {l.active ? `Expires ${l.expires} (${l.daysLeft}d left)` : `Expired ${l.expires}`}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {l.active && (
                            <button className="text-xs px-2.5 py-1 rounded border hover:bg-white" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>Copy link</button>
                          )}
                          <button className="text-xs px-2.5 py-1 rounded border hover:bg-red-50" style={{ borderColor: "var(--line)", color: "var(--danger)" }}>
                            {l.active ? "Revoke" : "Delete"}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Right: share panel */}
              {sharePanel && (
                <div className="w-80 shrink-0">
                  <div className="card sticky top-6">
                    <div className="card-head">
                      <span>Create share link</span>
                      <button onClick={() => { setSharePanel(false); setGeneratedLink(null); setSelectedFiles([]); }} className="text-lg leading-none" style={{ color: "var(--ink-soft)" }}>×</button>
                    </div>
                    <div className="card-pad space-y-4">
                      {!generatedLink ? (
                        <>
                          <div>
                            <label className="label">Files to include</label>
                            <div className="space-y-1.5 mt-1">
                              {MOCK_DOCS.map((d) => (
                                <label key={d.id} className="flex items-center gap-2 text-sm cursor-pointer">
                                  <input type="checkbox" checked={selectedFiles.includes(d.id)} onChange={() => toggleFile(d.id)} />
                                  <span className="truncate">{d.name}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="label">Who is this for?</label>
                            <input className="input w-full" placeholder="e.g., Eduardo Marin (CPA)" value={sentTo} onChange={(e) => setSentTo(e.target.value)} />
                          </div>
                          <div>
                            <label className="label">Link expires after</label>
                            <div className="flex gap-2 mt-1">
                              {[{ val: "7", label: "7 days" }, { val: "30", label: "30 days" }, { val: "90", label: "90 days" }].map(({ val, label }) => (
                                <button key={val} type="button" onClick={() => setExpiry(val)}
                                  className={`flex-1 py-1.5 rounded border text-xs ${expiry === val ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] font-medium" : "border-[var(--line)] bg-white"}`}>
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="label">Permissions</label>
                            <div className="flex gap-2 mt-1">
                              {[{ val: "view", label: "View only" }, { val: "download", label: "Allow download" }].map(({ val, label }) => (
                                <button key={val} type="button" onClick={() => setPermission(val)}
                                  className={`flex-1 py-1.5 rounded border text-xs ${permission === val ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] font-medium" : "border-[var(--line)] bg-white"}`}>
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Password protection */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="label mb-0">Password protect</label>
                              <button
                                type="button"
                                onClick={() => { setUsePassword(!usePassword); setPassword(""); }}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${usePassword ? "bg-[var(--brand)]" : "bg-gray-200"}`}
                              >
                                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${usePassword ? "translate-x-4" : "translate-x-1"}`} />
                              </button>
                            </div>
                            {usePassword && (
                              <div className="mt-2">
                                <div className="relative">
                                  <input
                                    className="input w-full pr-10"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Set a password for this link"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                  />
                                  <button
                                    type="button"
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs"
                                    style={{ color: "var(--ink-soft)" }}
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? "Hide" : "Show"}
                                  </button>
                                </div>
                                <p className="text-xs mt-1.5" style={{ color: "var(--ink-soft)" }}>
                                  Share this password separately — e.g., by phone or a different email.
                                </p>
                              </div>
                            )}
                            {!usePassword && (
                              <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
                                Optional — recipient opens link directly without a password.
                              </p>
                            )}
                          </div>

                          <button
                            className="btn w-full justify-center"
                            disabled={selectedFiles.length === 0 || (usePassword && !password)}
                            style={(selectedFiles.length === 0 || (usePassword && !password)) ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                            onClick={generateLink}
                          >
                            Generate link →
                          </button>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm text-green-700">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
                            Link created
                          </div>
                          <div>
                            <label className="label">Share this link</label>
                            <div className="flex gap-2 mt-1">
                              <input className="input flex-1 text-xs" readOnly value={generatedLink} />
                              <button className="btn text-xs px-3" onClick={() => navigator.clipboard?.writeText(generatedLink)}>Copy</button>
                            </div>
                          </div>
                          <div className="text-xs space-y-1.5 px-3 py-2.5 rounded-md" style={{ background: "#f9fbfa", color: "var(--ink-soft)" }}>
                            <div>📄 {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} included</div>
                            <div>⏱ Expires in {expiry} days</div>
                            <div>{permission === "view" ? "👁 View only — no download" : "⬇ Download allowed"}</div>
                            {sentTo && <div>👤 For: {sentTo}</div>}
                            {usePassword && password && (
                              <div className="flex items-center gap-1.5 pt-1 border-t mt-1.5" style={{ borderColor: "var(--line)" }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                <span>Password protected</span>
                                <code className="ml-auto bg-white px-1.5 py-0.5 rounded border font-mono text-[11px]" style={{ borderColor: "var(--line)" }}>{password}</code>
                              </div>
                            )}
                          </div>
                          {usePassword && password && (
                            <div className="px-3 py-2.5 rounded-md border text-xs" style={{ borderColor: "#c08a3e", background: "#fffbf0", color: "#92400e" }}>
                              <strong>Send the password separately</strong> — by phone, text, or a different email. Never in the same message as the link.
                            </div>
                          )}
                          <a
                            href="/mockup/share"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-ghost btn w-full justify-center text-sm"
                          >
                            Preview what they'll see →
                          </a>
                          <button className="btn-ghost btn w-full justify-center text-sm" onClick={() => { setGeneratedLink(null); setSelectedFiles([]); setSentTo(""); setPassword(""); setUsePassword(false); }}>
                            Create another link
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center text-xs pt-2" style={{ color: "var(--ink-soft)" }}>
              <Link href="/dashboard/clients/anita" className="hover:underline">← Back to Anita Reyes</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

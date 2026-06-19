'use client';

import { useState, useMemo } from "react";
import Link from "next/link";
import ViewDocumentButton from "../../../components/ViewDocumentButton";

type Row = {
  id: string;
  name: string;
  tag: string;
  source: string;
  uploaded: string;
  storagePath: string | null;
  clientId: string;
  clientName: string;
};

export default function DocumentsClient({ rows }: { rows: Row[] }) {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("All");
  const [source, setSource] = useState("All");

  const tags = ["All", ...Array.from(new Set(rows.map((d) => d.tag).filter(Boolean)))];
  const sources = ["All", ...Array.from(new Set(rows.map((d) => d.source).filter(Boolean)))];

  const filtered = rows.filter((d) => {
    if (tag !== "All" && d.tag !== tag) return false;
    if (source !== "All" && d.source !== source) return false;
    if (q && !d.name.toLowerCase().includes(q.toLowerCase()) && !d.clientName?.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const byTag = tags.slice(1).map((t) => ({
    tag: t,
    count: rows.filter((d) => d.tag === t).length,
  }));

  return (
    <div className="grid grid-cols-12 gap-5">
      <Kpi label="Total documents" value={String(rows.length)} hint="across all clients" />
      <Kpi label="From client upload" value={String(rows.filter((d) => d.source === "Client upload").length)} hint="via secure upload link" />
      <Kpi label="Karli uploads" value={String(rows.filter((d) => d.source === "Karli upload").length)} hint="uploaded from dashboard" />
      <Kpi label="From intake" value={String(rows.filter((d) => d.source === "Client intake").length)} hint="submitted via intake form" />

      <div className="col-span-12 lg:col-span-3 card">
        <div className="card-head"><span>By tag</span></div>
        <ul>
          <li
            className="px-5 py-2.5 border-t flex justify-between text-sm row-hover cursor-pointer"
            style={{ borderColor: "var(--line)" }}
            onClick={() => setTag("All")}
          >
            <span className={tag === "All" ? "font-semibold text-[var(--brand)]" : ""}>All tags</span>
            <span className="tabular-nums" style={{ color: "var(--ink-soft)" }}>{rows.length}</span>
          </li>
          {byTag.map((b) => (
            <li
              key={b.tag}
              className="px-5 py-2.5 border-t flex justify-between text-sm row-hover cursor-pointer"
              style={{ borderColor: "var(--line)" }}
              onClick={() => setTag(b.tag)}
            >
              <span className={tag === b.tag ? "font-semibold text-[var(--brand)]" : ""}>{b.tag}</span>
              <span className="tabular-nums" style={{ color: "var(--ink-soft)" }}>{b.count}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-12 lg:col-span-9 card">
        <div className="card-head">
          <span>All documents</span>
          <span className="text-xs normal-case font-normal">{filtered.length} shown</span>
        </div>
        <div className="card-pad flex flex-wrap items-center gap-3" style={{ borderBottom: "1px solid var(--line)" }}>
          <input
            className="input flex-1 min-w-[200px]"
            placeholder="Search by document or client…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <FilterGroup label="Source" value={source} setValue={setSource} options={sources} />
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left" style={{ color: "var(--ink-soft)" }}>
              <Th>Document</Th>
              <Th>Client</Th>
              <Th>Tag</Th>
              <Th>Source</Th>
              <Th>Uploaded</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id} className="row-hover border-t" style={{ borderColor: "var(--line)" }}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[var(--brand-soft)] text-[var(--brand-dark)] flex items-center justify-center text-xs font-semibold">
                      {d.tag?.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium">{d.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <Link href={`/dashboard/clients/${d.clientId}`} className="hover:underline" style={{ color: "var(--brand)" }}>
                    {d.clientName}
                  </Link>
                </td>
                <td className="px-5 py-3"><span className="pill pill-gray">{d.tag}</span></td>
                <td className="px-5 py-3"><SourceTag source={d.source} /></td>
                <td className="px-5 py-3 text-xs" style={{ color: "var(--ink-soft)" }}>{d.uploaded}</td>
                <td className="px-5 py-3">
                  <ViewDocumentButton storagePath={d.storagePath} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm" style={{ color: "var(--ink-soft)" }}>
                  {rows.length === 0 ? "No documents yet — they'll appear here once uploaded." : "No documents match these filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="col-span-12 sm:col-span-6 lg:col-span-3 card card-pad">
      <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--ink-soft)" }}>{label}</div>
      <div className="kpi-num mt-1">{value}</div>
      {hint && <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>{hint}</div>}
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">{children}</th>;
}

function FilterGroup({ label, value, setValue, options }: { label: string; value: string; setValue: (v: string) => void; options: string[] }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>{label}:</span>
      <div className="flex gap-1 flex-wrap">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => setValue(o)}
            className={`text-xs px-2.5 py-1 rounded-md border ${value === o ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] font-medium" : "border-[var(--line)] bg-white"}`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function SourceTag({ source }: { source: string }) {
  const palette: Record<string, { bg: string; fg: string }> = {
    "Client intake":  { bg: "#e8f3ec", fg: "#1f5a39" },
    "Client upload":  { bg: "#e8f0fe", fg: "#1a73e8" },
    "Karli upload":   { bg: "#fbeed4", fg: "#8a5a14" },
  };
  const p = palette[source] ?? { bg: "#eef0ee", fg: "#4a544f" };
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide" style={{ background: p.bg, color: p.fg }}>
      {source}
    </span>
  );
}

"use client";

import { useState } from "react";
import { fmtUSD, assetBreakdown, ASSET_CATEGORY_ORDER, ASSET_CATEGORY_META, type AssetCategory } from "@/lib/data";
import { saveNetWorth } from "@/app/dashboard/clients/[id]/actions";

type AssetRow = { id?: string; label: string; value: number | string; category: string; source?: string | null };
type LiabilityRow = { id?: string; label: string; balance: number | string; rate?: number | string | null };

// Editable local shapes (numbers held as strings for smooth typing)
type EAsset = { id?: string; label: string; category: string; value: string };
type ELiab = { id?: string; label: string; balance: string; rate: string };

const num = (v: number | string | null | undefined) =>
  typeof v === "string" ? parseFloat(v.replace(/[^0-9.-]/g, "")) || 0 : v ?? 0;

export default function NetWorthCard({
  assets = [],
  liabilities = [],
  clientId,
}: {
  assets?: AssetRow[];
  liabilities?: LiabilityRow[];
  clientId?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [eAssets, setEAssets] = useState<EAsset[]>([]);
  const [eLiabs, setELiabs] = useState<ELiab[]>([]);
  const [delAssets, setDelAssets] = useState<string[]>([]);
  const [delLiabs, setDelLiabs] = useState<string[]>([]);

  const startEdit = () => {
    setEAssets(assets.map((a) => ({ id: a.id, label: a.label, category: a.category || "Cash", value: String(num(a.value)) })));
    setELiabs(liabilities.map((l) => ({ id: l.id, label: l.label, balance: String(num(l.balance)), rate: l.rate == null ? "" : String(l.rate) })));
    setDelAssets([]);
    setDelLiabs([]);
    setErr(null);
    setEditing(true);
  };

  const cancel = () => { setEditing(false); setErr(null); };

  const save = async () => {
    if (!clientId) return;
    setSaving(true);
    setErr(null);
    const res = await saveNetWorth(
      clientId,
      eAssets.filter((a) => a.label.trim()).map((a) => ({ id: a.id, label: a.label, value: num(a.value), category: a.category })),
      eLiabs.filter((l) => l.label.trim()).map((l) => ({ id: l.id, label: l.label, balance: num(l.balance), rate: l.rate.trim() === "" ? null : num(l.rate) })),
      delAssets,
      delLiabs,
    );
    setSaving(false);
    if (res?.success) { setEditing(false); }
    else { setErr(res?.error || "Something went wrong"); }
  };

  // ── Read-mode figures ──
  const totalAssets = assets.reduce((s, a) => s + num(a.value), 0);
  const totalLiab = liabilities.reduce((s, l) => s + num(l.balance), 0);
  const net = totalAssets - totalLiab;
  const breakdown = assetBreakdown(assets as any);
  const hasData = assets.length > 0 || liabilities.length > 0;

  // ── Edit-mode live figures ──
  const eTotalAssets = eAssets.reduce((s, a) => s + num(a.value), 0);
  const eTotalLiab = eLiabs.reduce((s, l) => s + num(l.balance), 0);
  const eNet = eTotalAssets - eTotalLiab;

  return (
    <div className="col-span-12 card">
      <div className="card-head">
        <div className="flex flex-col gap-0.5">
          <span>Net worth</span>
          <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>
            Assets and liabilities from the client's financial profile
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold tabular-nums" style={{ color: "var(--brand-dark)" }}>{fmtUSD(editing ? eNet : net)}</span>
          {!editing && clientId && (
            <button onClick={startEdit} className="btn-ghost btn text-xs normal-case">Edit</button>
          )}
        </div>
      </div>

      {/* ─────────── EDIT MODE ─────────── */}
      {editing ? (
        <div className="card-pad space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Kpi label="Net worth" value={fmtUSD(eNet)} accent />
            <Kpi label="Total assets" value={fmtUSD(eTotalAssets)} />
            <Kpi label="Total liabilities" value={eTotalLiab > 0 ? `−${fmtUSD(eTotalLiab)}` : fmtUSD(0)} />
          </div>

          {/* Assets editor */}
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--ink-soft)" }}>Assets</div>
            <div className="space-y-2">
              {eAssets.map((a, i) => (
                <div key={i} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                  <input
                    className="input flex-1 min-w-[140px]"
                    placeholder="Account / asset name"
                    value={a.label}
                    onChange={(e) => setEAssets(upd(eAssets, i, { label: e.target.value }))}
                  />
                  <select
                    className="select w-full sm:w-[130px]"
                    value={a.category}
                    onChange={(e) => setEAssets(upd(eAssets, i, { category: e.target.value }))}
                  >
                    {ASSET_CATEGORY_ORDER.map((c) => (
                      <option key={c} value={c}>{ASSET_CATEGORY_META[c as AssetCategory]?.label ?? c}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--ink-soft)" }}>$</span>
                      <input
                        className="input w-[130px] pl-5 tabular-nums text-right"
                        inputMode="decimal"
                        placeholder="0"
                        value={a.value}
                        onChange={(e) => setEAssets(upd(eAssets, i, { value: e.target.value }))}
                      />
                    </div>
                    <button type="button" onClick={() => removeAsset(i)} className="shrink-0 w-8 h-8 rounded-md flex items-center justify-center hover:bg-red-50" style={{ color: "#b4453a" }} title="Remove">✕</button>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="btn-ghost btn text-xs normal-case mt-2" onClick={() => setEAssets([...eAssets, { label: "", category: "Cash", value: "" }])}>
              + Add asset
            </button>
          </div>

          {/* Liabilities editor */}
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--ink-soft)" }}>Liabilities</div>
            <div className="space-y-2">
              {eLiabs.map((l, i) => (
                <div key={i} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                  <input
                    className="input flex-1 min-w-[140px]"
                    placeholder="Loan / liability name"
                    value={l.label}
                    onChange={(e) => setELiabs(upd(eLiabs, i, { label: e.target.value }))}
                  />
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--ink-soft)" }}>$</span>
                      <input
                        className="input w-[130px] pl-5 tabular-nums text-right"
                        inputMode="decimal"
                        placeholder="0"
                        value={l.balance}
                        onChange={(e) => setELiabs(upd(eLiabs, i, { balance: e.target.value }))}
                      />
                    </div>
                    <div className="relative">
                      <input
                        className="input w-[76px] pr-5 tabular-nums text-right"
                        inputMode="decimal"
                        placeholder="rate"
                        value={l.rate}
                        onChange={(e) => setELiabs(upd(eLiabs, i, { rate: e.target.value }))}
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--ink-soft)" }}>%</span>
                    </div>
                    <button type="button" onClick={() => removeLiab(i)} className="shrink-0 w-8 h-8 rounded-md flex items-center justify-center hover:bg-red-50" style={{ color: "#b4453a" }} title="Remove">✕</button>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="btn-ghost btn text-xs normal-case mt-2" onClick={() => setELiabs([...eLiabs, { label: "", balance: "", rate: "" }])}>
              + Add liability
            </button>
          </div>

          {err && <div className="text-sm px-3 py-2 rounded-md" style={{ background: "#fff5f5", color: "#842029" }}>{err}</div>}

          <div className="flex gap-2 pt-1 border-t" style={{ borderColor: "var(--line)" }}>
            <button className="btn text-sm mt-3" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
            <button className="btn-ghost btn text-sm mt-3" onClick={cancel} disabled={saving}>Cancel</button>
          </div>
        </div>
      ) : !hasData ? (
        <div className="card-pad text-sm flex items-center justify-between gap-3" style={{ color: "var(--ink-soft)" }}>
          <span>No assets or liabilities on file yet.</span>
          {clientId && <button onClick={startEdit} className="btn-ghost btn text-xs normal-case shrink-0">+ Add</button>}
        </div>
      ) : (
        /* ─────────── READ MODE ─────────── */
        <div className="card-pad space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Kpi label="Net worth" value={fmtUSD(net)} accent />
            <Kpi label="Total assets" value={fmtUSD(totalAssets)} />
            <Kpi label="Total liabilities" value={totalLiab > 0 ? `−${fmtUSD(totalLiab)}` : fmtUSD(0)} />
          </div>

          {totalAssets > 0 && (
            <div>
              <div className="flex h-2.5 w-full overflow-hidden rounded-full" style={{ background: "var(--line)" }}>
                {breakdown.map((b) => (
                  <div key={b.category} style={{ width: `${b.pct}%`, background: b.color }} title={`${b.label} · ${b.pct.toFixed(1)}%`} />
                ))}
              </div>
              <ul className="mt-3 space-y-1.5">
                {breakdown.map((b) => (
                  <li key={b.category} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: b.color }} />
                      <span className="truncate">{b.label}</span>
                      <span className="text-xs tabular-nums" style={{ color: "var(--ink-soft)" }}>{b.pct.toFixed(1)}%</span>
                    </span>
                    <span className="font-medium tabular-nums">{fmtUSD(b.value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {breakdown.map((b) => {
            const items = assets.filter((a) => a.category === b.category);
            if (items.length === 0) return null;
            return (
              <div key={`grp-${b.category}`}>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold mb-1.5" style={{ color: "var(--ink-soft)" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: b.color }} />
                  {b.label}
                </div>
                <ul className="rounded-md border divide-y" style={{ borderColor: "var(--line)" }}>
                  {items.map((a, i) => (
                    <li key={i} className="px-3 py-2 flex items-center justify-between text-sm" style={{ borderColor: "var(--line)" }}>
                      <span className="truncate">{a.label}</span>
                      <span className="font-medium tabular-nums">{fmtUSD(num(a.value))}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {liabilities.length > 0 && (
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold mb-1.5" style={{ color: "var(--ink-soft)" }}>Liabilities</div>
              <ul className="rounded-md border divide-y" style={{ borderColor: "var(--line)" }}>
                {liabilities.map((l, i) => (
                  <li key={i} className="px-3 py-2 flex items-center justify-between text-sm" style={{ borderColor: "var(--line)" }}>
                    <span className="truncate">
                      {l.label}
                      {l.rate != null && l.rate !== "" && (
                        <span className="text-xs ml-2" style={{ color: "var(--ink-soft)" }}>{num(l.rate)}%</span>
                      )}
                    </span>
                    <span className="font-medium tabular-nums" style={{ color: "#b4453a" }}>−{fmtUSD(num(l.balance))}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );

  function removeAsset(i: number) {
    const a = eAssets[i];
    if (a.id) setDelAssets((d) => [...d, a.id!]);
    setEAssets(eAssets.filter((_, j) => j !== i));
  }
  function removeLiab(i: number) {
    const l = eLiabs[i];
    if (l.id) setDelLiabs((d) => [...d, l.id!]);
    setELiabs(eLiabs.filter((_, j) => j !== i));
  }
}

function upd<T>(arr: T[], i: number, patch: Partial<T>): T[] {
  const copy = arr.slice();
  copy[i] = { ...copy[i], ...patch };
  return copy;
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-md border p-3" style={{ borderColor: "var(--line)", background: accent ? "var(--brand-soft)" : "transparent" }}>
      <div className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--ink-soft)" }}>{label}</div>
      <div className="text-lg font-semibold tabular-nums" style={{ color: accent ? "var(--brand-dark)" : "var(--ink)" }}>{value}</div>
    </div>
  );
}

import { fmtUSD, assetBreakdown } from "../lib/data";

type AssetRow = { label: string; value: number | string; category: string; source?: string | null };
type LiabilityRow = { label: string; balance: number | string; rate?: number | string | null };

const num = (v: number | string | null | undefined) =>
  typeof v === "string" ? parseFloat(v) || 0 : v ?? 0;

export default function NetWorthCard({
  assets = [],
  liabilities = [],
}: {
  assets?: AssetRow[];
  liabilities?: LiabilityRow[];
}) {
  const totalAssets = assets.reduce((s, a) => s + num(a.value), 0);
  const totalLiab = liabilities.reduce((s, l) => s + num(l.balance), 0);
  const net = totalAssets - totalLiab;
  const breakdown = assetBreakdown(assets);

  const hasData = assets.length > 0 || liabilities.length > 0;

  return (
    <div className="col-span-12 card">
      <div className="card-head">
        <div className="flex flex-col gap-0.5">
          <span>Net worth</span>
          <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>
            Assets and liabilities from the client's financial profile
          </span>
        </div>
        <span className="text-lg font-semibold tabular-nums" style={{ color: "var(--brand-dark)" }}>{fmtUSD(net)}</span>
      </div>

      {!hasData ? (
        <div className="card-pad text-sm" style={{ color: "var(--ink-soft)" }}>
          No assets or liabilities on file yet.
        </div>
      ) : (
        <div className="card-pad space-y-5">
          {/* KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Kpi label="Net worth" value={fmtUSD(net)} accent />
            <Kpi label="Total assets" value={fmtUSD(totalAssets)} />
            <Kpi label="Total liabilities" value={totalLiab > 0 ? `−${fmtUSD(totalLiab)}` : fmtUSD(0)} />
          </div>

          {/* Allocation bar */}
          {totalAssets > 0 && (
            <div>
              <div className="flex h-2.5 w-full overflow-hidden rounded-full" style={{ background: "var(--line)" }}>
                {breakdown.map((b) => (
                  <div key={b.category} style={{ width: `${b.pct}%`, background: b.color }} title={`${b.label} · ${b.pct.toFixed(1)}%`} />
                ))}
              </div>

              {/* Category breakdown list */}
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

          {/* Asset line items grouped by category */}
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

          {/* Liabilities */}
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
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-md border p-3" style={{ borderColor: "var(--line)", background: accent ? "var(--brand-soft)" : "transparent" }}>
      <div className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--ink-soft)" }}>{label}</div>
      <div className="text-lg font-semibold tabular-nums" style={{ color: accent ? "var(--brand-dark)" : "var(--ink)" }}>{value}</div>
    </div>
  );
}

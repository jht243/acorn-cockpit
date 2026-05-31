import Sidebar from "../Sidebar";
import TopBar from "../TopBar";

type Props = {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  sources: string[];
};

export default function Placeholder({ title, subtitle, description, features, sources }: Props) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title={title} />
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="card card-pad" style={{ paddingTop: 36, paddingBottom: 36 }}>
              <div className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--brand)" }}>{subtitle}</div>
              <h1 className="text-2xl font-semibold tracking-tight mb-3">{title}</h1>
              <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>{description}</p>

              <div className="text-[11px] uppercase tracking-wider font-semibold mb-3" style={{ color: "var(--ink-soft)" }}>What this page does</div>
              <ul className="space-y-2 mb-6">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5" className="mt-0.5 shrink-0"><path d="M5 13l4 4L19 7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--ink-soft)" }}>Powered by</div>
              <div className="flex flex-wrap gap-2">
                {sources.map((s) => (
                  <span key={s} className="pill pill-gray">{s}</span>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t text-xs" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>
                Coming in Phase 2 of the Acorn Cockpit build.
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

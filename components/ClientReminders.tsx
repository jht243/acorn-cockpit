"use client";
import { useState } from "react";
import { updateReminders } from "@/app/dashboard/clients/[id]/actions";

type Reminder = { id: string; date: string; label: string };

export default function ClientReminders({ clientId, initialReminders }: { clientId: string; initialReminders: Reminder[] }) {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders || []);
  const [date, setDate] = useState("");
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);

  const persist = async (updated: Reminder[]) => {
    setSaving(true);
    await updateReminders(clientId, updated);
    setSaving(false);
  };

  const add = async () => {
    if (!label.trim() || !date) return;
    const updated = [...reminders, { id: crypto.randomUUID(), date, label: label.trim() }]
      .sort((a, b) => a.date.localeCompare(b.date));
    setReminders(updated);
    setDate("");
    setLabel("");
    await persist(updated);
  };

  const remove = async (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    await persist(updated);
  };

  return (
    <div>
      {/* Add row */}
      <div className="card-pad border-b flex flex-wrap items-end gap-3" style={{ borderColor: "var(--line)" }}>
        <div>
          <label className="label">Date</label>
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="label">Reminder</label>
          <input
            className="input w-full"
            placeholder="e.g., Annual review, Policy renewal check…"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
        </div>
        <button
          className="btn shrink-0"
          disabled={!label.trim() || !date || saving}
          onClick={add}
        >
          + Add
        </button>
      </div>
      <ul>
        {reminders.length === 0 && (
          <li className="px-5 py-4 text-sm" style={{ color: "var(--ink-soft)" }}>
            No reminders yet — add one above.
          </li>
        )}
        {reminders.map((r) => {
          const isPast = r.date < new Date().toISOString().slice(0, 10);
          return (
            <li key={r.id} className="px-5 py-3 border-t flex items-center gap-3" style={{ borderColor: "var(--line)" }}>
              <div className="w-24 shrink-0">
                <div className={`text-xs font-semibold ${isPast ? "line-through opacity-50" : ""}`}>
                  {new Date(r.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
                {isPast && <div className="text-[10px]" style={{ color: "var(--ink-soft)" }}>past</div>}
              </div>
              <div className={`flex-1 text-sm ${isPast ? "opacity-50" : ""}`}>{r.label}</div>
              <button
                className="text-xs px-2 py-1 rounded shrink-0 hover:bg-red-50"
                style={{ color: "var(--danger)" }}
                onClick={() => remove(r.id)}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

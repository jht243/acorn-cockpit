"use client";
import { useState } from "react";
import { updateClientGoals } from "@/app/dashboard/clients/[id]/actions";

export default function EditableGoals({ clientId, goals }: { clientId: string; goals: string[] }) {
  const [editing, setEditing] = useState(false);
  const [items, setItems] = useState<string[]>(goals.length ? goals : [""]);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const cleaned = items.map((g) => g.trim()).filter(Boolean);
    await updateClientGoals(clientId, cleaned);
    setItems(cleaned.length ? cleaned : [""]);
    setSaving(false);
    setEditing(false);
  };

  const cancel = () => {
    setItems(goals.length ? goals : [""]);
    setEditing(false);
  };

  if (!editing) {
    return (
      <div>
        {items.filter(Boolean).length === 0 ? (
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>No goals recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {items.filter(Boolean).map((g, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5" className="mt-0.5 shrink-0"><path d="M5 13l4 4L19 7"/></svg>
                {g}
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={() => setEditing(true)}
          className="btn-ghost btn text-xs normal-case mt-3"
        >
          Edit goals
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((g, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            className="input flex-1"
            value={g}
            onChange={(e) => {
              const copy = items.slice();
              copy[i] = e.target.value;
              setItems(copy);
            }}
            placeholder="e.g., Retire by 60"
            autoFocus={i === items.length - 1 && g === ""}
          />
          <button
            type="button"
            onClick={() => setItems(items.filter((_, j) => j !== i))}
            className="text-xs px-2 py-1 rounded hover:bg-red-50"
            style={{ color: "var(--danger)" }}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn-ghost btn text-xs normal-case"
        onClick={() => setItems([...items, ""])}
      >
        + Add goal
      </button>
      <div className="flex gap-2 pt-1">
        <button className="btn text-sm" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button className="btn-ghost btn text-sm" onClick={cancel}>Cancel</button>
      </div>
    </div>
  );
}

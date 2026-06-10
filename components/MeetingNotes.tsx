"use client";
import { useState } from "react";
import { updateMeetingNotes } from "@/app/dashboard/clients/[id]/actions";

export default function MeetingNotes({ clientId, initialNotes }: { clientId: string; initialNotes: string }) {
  const [notes, setNotes] = useState(initialNotes || "");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const save = async () => {
    setSaveStatus("saving");
    await updateMeetingNotes(clientId, notes);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  return (
    <div className="card-pad space-y-3">
      <textarea
        className="textarea w-full"
        rows={6}
        placeholder="Add meeting notes here — date, what was discussed, follow-ups…"
        value={notes}
        onChange={(e) => { setNotes(e.target.value); setSaveStatus("idle"); }}
        onBlur={save}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
          Notes are private to Karli — not visible to the client.
        </span>
        <div className="flex items-center gap-2">
          {saveStatus === "saved" && (
            <span className="text-xs flex items-center gap-1" style={{ color: "#16a34a" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5L20 6"/></svg>
              Saved
            </span>
          )}
          <button
            className="btn text-xs"
            disabled={saveStatus === "saving"}
            onClick={save}
          >
            {saveStatus === "saving" ? "Saving…" : "Save notes"}
          </button>
        </div>
      </div>
    </div>
  );
}

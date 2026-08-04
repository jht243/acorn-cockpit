import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "../../../../components/Sidebar";
import TopBar from "../../../../components/TopBar";
import SendReminderButton from "../../../../components/SendReminderButton";
import CopyIntakeLinkButton from "../../../../components/CopyIntakeLinkButton";
import ApproveIntakeButton from "../../../../components/ApproveIntakeButton";
import ClientTasks from "../../../../components/ClientTasks";
import EditableGoals from "../../../../components/EditableGoals";
import MeetingNotes from "../../../../components/MeetingNotes";
import ClientReminders from "../../../../components/ClientReminders";
import DocumentUploadButton from "../../../../components/DocumentUploadButton";
import ViewDocumentButton from "../../../../components/ViewDocumentButton";
import RequestDocumentsButton from "../../../../components/RequestDocumentsButton";
import NetWorthCard from "../../../../components/NetWorthCard";
import MoreInfoCard from "../../../../components/MoreInfoCard";
import { getClientById } from "../../../../utils/supabase/queries";
import { intakeProgress, intakeProgressPillClass } from "../../../../lib/intake-progress";
import { deriveClientStatus } from "../../../../lib/client-status";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ClientDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await getClientById(id);
  if (!client) return notFound();

  const ip = intakeProgress(client);
  const fd = client.intake_form_data || {};

  // Contact info — prefer direct columns, fall back to intake_form_data
  const phone = client.phone || fd.phone || null;
  const address = fd.address || null;
  const dob = fd.dob || null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title={client.name} breadcrumb={[{ label: "Clients", href: "/dashboard/clients" }, { label: client.name }]} />
        <main className="flex-1 p-6">
          <div className="grid grid-cols-12 gap-5">

            {/* ── Header card ── */}
            <div className="col-span-12 card card-pad">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[var(--brand-soft)] text-[var(--brand-dark)] flex items-center justify-center font-semibold text-lg">
                    {client.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{client.name}</div>
                    {client.family && <div className="text-sm" style={{ color: "var(--ink-soft)" }}>{client.family}</div>}
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`pill ${client.plan === "Mahogany" ? "pill-amber" : client.plan === "Sycamore" ? "pill-green" : "pill-gray"}`}>{client.plan}</span>
                      {(() => {
                        const s = deriveClientStatus(client);
                        return <span className={`pill ${s.pillClass}`} title={s.tooltip}>{s.label}</span>;
                      })()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                  {!client.intake_submitted_at ? (
                    <>
                      <div className="px-3 py-1.5 rounded-md border" style={{ borderColor: "var(--brand-soft)", background: "var(--brand-soft)" }}>
                        <SendReminderButton clientId={client.id} lastReminderAt={client.intake_last_reminder_at} remindersSent={client.intake_reminders_sent} />
                      </div>
                      <a href={`/intake?token=${client.intake_token}&from=admin&clientId=${client.id}`} target="_blank" rel="noopener noreferrer" className="btn-ghost btn">
                        {`Open ${client.name.split(" ")[0]}'s Form`}
                      </a>
                      <CopyIntakeLinkButton token={client.intake_token} />
                    </>
                  ) : (
                    <ApproveIntakeButton clientId={client.id} approvedAt={client.intake_approved_at} />
                  )}
                </div>
              </div>

              <div className="divider" />

              {/* Contact info row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
                <ContactField label="Email" value={client.email} href={`mailto:${client.email}`} />
                <ContactField label="Phone" value={phone} href={phone ? `tel:${phone}` : undefined} />
                <ContactField label="Date of birth" value={dob} />
                <ContactField label="Address" value={address} />
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--ink-soft)" }}>Last contact</div>
                  <div className="text-sm font-medium">{client.last_contact ? new Date(client.last_contact).toLocaleDateString() : "—"}</div>
                  {client.last_contact_signal && (
                    <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--ink-soft)" }}>
                      <SourceBadge source={client.last_contact_signal.source} />
                      <span className="truncate">{client.last_contact_signal.label}</span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--ink-soft)" }}>Next meeting</div>
                  <div className="text-sm font-medium">{client.next_meeting ? new Date(client.next_meeting).toLocaleDateString() : "—"}</div>
                  {client.next_meeting && <div className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>via Calendly</div>}
                </div>
              </div>
            </div>

            {/* ── Net worth (assets + liabilities breakdown) ── */}
            <NetWorthCard assets={client.assets || []} liabilities={client.liabilities || []} />

            {/* ── Goals (top, editable) ── */}
            <div className="col-span-12 lg:col-span-7 card">
              <div className="card-head">
                <span>Goals</span>
              </div>
              <div className="card-pad">
                <EditableGoals clientId={client.id} goals={client.goals || []} />
              </div>
            </div>

            {/* ── Intake status ── */}
            <div className="col-span-12 lg:col-span-5 card">
              <div className="card-head">
                <div className="flex flex-col gap-0.5">
                  <span>Intake</span>
                  <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>
                    {client.intake_submitted_at ? `Submitted ${new Date(client.intake_submitted_at).toLocaleDateString()}` : "Not yet submitted"}
                  </span>
                </div>
                <span className={`pill ${intakeProgressPillClass(ip.kind)}`}>{ip.label}</span>
              </div>
              <div className="card-pad space-y-3">
                {client.intake_submitted_at ? (
                  <>
                    {fd.whatBringsYouOptions?.length > 0 && (
                      <div>
                        <div className="text-xs font-medium mb-1" style={{ color: "var(--ink-soft)" }}>What brought them here</div>
                        <div className="text-sm">{(fd.whatBringsYouOptions as string[]).join(", ")}</div>
                      </div>
                    )}
                    {fd.goalUrgency && (
                      <div>
                        <div className="text-xs font-medium mb-1" style={{ color: "var(--ink-soft)" }}>Goal urgency</div>
                        <div className="text-sm capitalize">{fd.goalUrgency.replace("year", "In the next year").replace("ahead", "Looking ahead").replace("urgent", "Urgent").replace("exploring", "Just exploring")}</div>
                      </div>
                    )}
                    {fd.risk && (
                      <div>
                        <div className="text-xs font-medium mb-1" style={{ color: "var(--ink-soft)" }}>Risk tolerance</div>
                        <div className="text-sm">{fd.risk}</div>
                      </div>
                    )}
                    {fd.largestObstacle && (
                      <div>
                        <div className="text-xs font-medium mb-1" style={{ color: "var(--ink-soft)" }}>Largest obstacle</div>
                        <div className="text-sm">{fd.largestObstacle}</div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <span className="text-sm flex-1" style={{ color: "var(--ink-soft)" }}>
                      {ip.kind === "invited" ? "Invited but not yet started." : ip.kind === "in_progress" ? `${ip.pct}% complete — not submitted yet.` : "Not started."}
                    </span>
                  </div>
                )}
                {!client.intake_submitted_at && (
                  <div className="flex gap-2 pt-1">
                    <SendReminderButton clientId={client.id} lastReminderAt={client.intake_last_reminder_at} remindersSent={client.intake_reminders_sent} />
                    <a href={`/intake?token=${client.intake_token}&from=admin&clientId=${client.id}`} target="_blank" rel="noopener noreferrer" className="btn-ghost btn text-xs">
                      Open form
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* ── Help call banner ── */}
            {client.help_requested && (
              <div className="col-span-12 flex items-start gap-3 px-4 py-3 rounded-md border" style={{ borderColor: "#f5c2c7", background: "#fff5f5" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <div className="flex-1">
                  <div className="text-sm font-semibold" style={{ color: "#842029" }}>Client requested a help call</div>
                  <div className="text-xs mt-0.5" style={{ color: "#842029", opacity: 0.8 }}>
                    Flagged the <strong>{client.help_request_section || "intake"}</strong> section.
                  </div>
                </div>
                <a href="https://calendly.com/karli-acorn-care/30min" target="_blank" rel="noopener noreferrer" className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-md border" style={{ borderColor: "#c0392b", color: "#842029" }}>
                  Schedule call →
                </a>
              </div>
            )}

            {/* ── Review flags ── */}
            {client.review_with_acorn_sections && (client.review_with_acorn_sections as string[]).length > 0 && (
              <div className="col-span-12 card">
                <div className="card-head">
                  <div className="flex flex-col gap-0.5">
                    <span>Flagged for Review</span>
                    <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>Client asked to review these sections together</span>
                  </div>
                  <span className="pill pill-amber">{(client.review_with_acorn_sections as string[]).length} section{(client.review_with_acorn_sections as string[]).length > 1 ? "s" : ""}</span>
                </div>
                <div className="card-pad flex flex-wrap gap-2">
                  {(client.review_with_acorn_sections as string[]).map((s: string) => (
                    <span key={s} className="px-3 py-1.5 rounded-md border text-sm font-medium" style={{ borderColor: "var(--brand-soft)", background: "var(--brand-soft)", color: "var(--brand-dark)" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── Professional team ── */}
            <div className="col-span-12 lg:col-span-5 card">
              <div className="card-head"><span>Professional team</span><button className="btn-ghost btn text-xs normal-case">+ Add</button></div>
              <ul>
                {(client.team || []).map((t: any, i: number) => (
                  <li key={i} className="px-5 py-2.5 border-t flex items-center justify-between" style={{ borderColor: "var(--line)" }}>
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs" style={{ color: "var(--ink-soft)" }}>{t.role}{t.firm && ` · ${t.firm}`}</div>
                    </div>
                    {t.email && <a href={`mailto:${t.email}`} className="text-xs" style={{ color: "var(--brand)" }}>email</a>}
                  </li>
                ))}
                {(!client.team || client.team.length === 0) && (
                  <li className="px-5 py-3 text-sm" style={{ color: "var(--ink-soft)" }}>No team contacts yet.</li>
                )}
              </ul>
            </div>

            {/* ── Action items ── */}
            <ClientTasks
              clientId={client.id}
              clientName={client.name}
              clientEmail={client.email}
              items={client.action_items || []}
            />

            {/* ── Documents ── */}
            <div className="col-span-12 card">
              <div className="card-head">
                <div className="flex flex-col gap-0.5">
                  <span>Documents</span>
                  <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>
                    Uploaded via intake form or by Karli
                  </span>
                </div>
                <RequestDocumentsButton clientId={client.id} clientName={client.name} clientEmail={client.email} />
                <DocumentUploadButton clientId={client.id} />
              </div>
              <ul>
                {(client.documents || []).map((d: any, i: number) => (
                  <li key={i} className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: "var(--line)" }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded bg-[var(--brand-soft)] text-[var(--brand-dark)] flex items-center justify-center text-xs font-semibold shrink-0">{d.tag?.slice(0, 2).toUpperCase()}</div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{d.name}</div>
                        <div className="text-xs flex items-center gap-1.5 flex-wrap" style={{ color: "var(--ink-soft)" }}>
                          <span>{d.tag}</span>
                          <span>·</span>
                          <span>{d.uploaded_at || d.uploaded}</span>
                          <span>·</span>
                          <span className="pill pill-gray" style={{ fontSize: 10, padding: "1px 6px" }}>{d.source}</span>
                        </div>
                      </div>
                    </div>
                    <ViewDocumentButton storagePath={d.storage_path} />
                  </li>
                ))}
                {(!client.documents || client.documents.length === 0) && (
                  <li className="px-5 py-3 text-sm" style={{ color: "var(--ink-soft)" }}>No documents yet — they'll appear here once uploaded.</li>
                )}
              </ul>
            </div>

            {/* ── Intake responses ── */}
            {(client.intakeResponses || client.intake_responses)?.length > 0 && (
              <div className="col-span-12 card">
                <div className="card-head">
                  <div className="flex flex-col gap-0.5">
                    <span>Intake form responses</span>
                    <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>
                      {client.intake_submitted_at ? `Submitted ${new Date(client.intake_submitted_at).toLocaleDateString()}` : ""}
                    </span>
                  </div>
                </div>
                <ul>
                  {(client.intakeResponses || client.intake_responses || []).map((r: any, i: number) => (
                    <li key={i} className="px-5 py-2.5 border-t" style={{ borderColor: "var(--line)" }}>
                      <div className="text-xs font-medium" style={{ color: "var(--ink-soft)" }}>{r.question}</div>
                      <div className="text-sm mt-0.5">{r.answer}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Meeting notes ── */}
            <div className="col-span-12 card">
              <div className="card-head">
                <div className="flex flex-col gap-0.5">
                  <span>Meeting notes</span>
                  <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>
                    Private notes — add dates, summaries, and follow-ups as you go
                  </span>
                </div>
              </div>
              <MeetingNotes clientId={client.id} initialNotes={client.meeting_notes || ""} />
            </div>

            {/* ── Reminders ── */}
            <div className="col-span-12 card">
              <div className="card-head">
                <div className="flex flex-col gap-0.5">
                  <span>Reminders</span>
                  <span className="text-[10px] normal-case font-normal tracking-normal" style={{ color: "var(--ink-soft)" }}>
                    Add a reminder for yourself or the client — policy renewals, annual reviews, deadlines
                  </span>
                </div>
              </div>
              <ClientReminders clientId={client.id} initialReminders={client.reminders || []} />
            </div>

            {/* ── More info (collapsed by default — additive, doesn't affect existing UX) ── */}
            <MoreInfoCard
              insurance={client.insurance_policies || []}
              estate={client.estate_documents || []}
              beneficiaries={client.beneficiaries || []}
              household={client.household_members || []}
              assets={client.assets || []}
            />

          </div>
        </main>
      </div>
    </div>
  );
}

function ContactField({ label, value, href }: { label: string; value: string | null | undefined; href?: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--ink-soft)" }}>{label}</div>
      {value ? (
        href ? (
          <a href={href} className="text-sm font-medium hover:underline" style={{ color: "var(--brand)" }}>{value}</a>
        ) : (
          <div className="text-sm font-medium">{value}</div>
        )
      ) : (
        <div className="text-sm" style={{ color: "var(--ink-soft)" }}>—</div>
      )}
    </div>
  );
}

function SourceBadge({ source }: { source: string }) {
  const palette: Record<string, { bg: string; fg: string }> = {
    "Google Cal": { bg: "#e8f0fe", fg: "#1a73e8" },
    "Gmail": { bg: "#fce8e6", fg: "#c5221f" },
    "Calendly": { bg: "#e7f0ff", fg: "#0069ff" },
    "Fathom": { bg: "#f1ecfe", fg: "#5b3dbe" },
  };
  const p = palette[source] ?? { bg: "#eef0ee", fg: "#4a544f" };
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide" style={{ background: p.bg, color: p.fg }}>
      {source}
    </span>
  );
}

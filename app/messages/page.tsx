import Placeholder from "../../components/placeholders/Placeholder";

export default function Page() {
  return (
    <Placeholder
      title="Messages"
      subtitle="Client communication"
      description="A single inbox for every client conversation — emails, intake reminders, action item nudges, document requests — with templates so you're never starting from a blank page."
      features={[
        "Unified Gmail thread view per client (read-only sync)",
        "Template library: intake link, missing document, 30-day follow-up, 6-month review",
        "Auto-nudges: action items overdue, intake stalled, policy renewal coming up",
        "Send-from-Acorn email with branded signature, tracked in client timeline",
      ]}
      sources={["Gmail", "Resend", "Cadence engine"]}
    />
  );
}

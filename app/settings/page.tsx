import Placeholder from "../../components/placeholders/Placeholder";

export default function Page() {
  return (
    <Placeholder
      title="Settings"
      subtitle="Workspace"
      description="Configure how the cockpit works for you — branding on client-facing assets, integration credentials, cadence rules, and team access if you ever bring on an associate."
      features={[
        "Branding: logo, colors, signature for proposals, PFS, and client emails",
        "Integrations: Google Workspace, Calendly, Plaid, Fathom, Resend — connect/disconnect",
        "Cadence rules: tweak default 30-day / 6-month / annual reminders per plan tier",
        "Team: invite an assistant or paraplanner with role-based permissions",
        "Compliance: disclosure footer, data retention, audit log export",
      ]}
      sources={["Workspace settings"]}
    />
  );
}

import Placeholder from "../../components/placeholders/Placeholder";

export default function Page() {
  return (
    <Placeholder
      title="Calendar"
      subtitle="Schedule"
      description="A unified view of every meeting on your books — intro calls, plan reviews, 30-day follow-ups, 6-month reviews — with one-click prep notes and post-meeting action item review."
      features={[
        "Two-way sync with Google Calendar and Calendly bookings",
        "Pre-meeting brief auto-generated 24 hours before each appointment (client snapshot, last action items, agenda)",
        "Post-meeting review queue: confirm Fathom-extracted action items before they go live",
        "Block off prep time + travel automatically based on meeting type",
      ]}
      sources={["Google Calendar", "Calendly", "Fathom"]}
    />
  );
}

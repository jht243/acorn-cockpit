// Pure email templates — no side effects, safe to import from both server
// (Resend sender) and client components (preview), so the preview Karli sees
// always matches what actually gets sent.

// Calendly link offered in client-facing emails. NEXT_PUBLIC_ so it's available
// both server-side (sending) and client-side (preview). Keep in sync with the
// fallback in lib/resend.ts.
export const BOOKING_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/acorn-care/intro-call';

export function taskReminderSubject(taskTitle: string) {
  return `Reminder: ${taskTitle}`;
}

export function taskReminderHtml(clientName: string, taskTitle: string, bookingUrl: string = BOOKING_URL) {
  const first = (clientName || '').split(' ')[0] || 'there';
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; color: #1f2a24;">
      <div style="border-bottom: 3px solid #2f7d4f; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="font-size: 22px; margin: 0; color: #1f5a39;">Acorn Care</h1>
        <p style="font-size: 13px; color: #6b7670; margin: 4px 0 0;">Concierge Financial Planning</p>
      </div>
      <p style="font-size: 16px;">Hi ${first},</p>
      <p style="font-size: 15px; line-height: 1.6;">We still have a task pending for you:</p>
      <div style="margin: 16px 0; padding: 14px 18px; background: #f4faf5; border-left: 4px solid #2f7d4f; border-radius: 4px; font-size: 15px; font-weight: 600; color: #1f5a39;">
        ${taskTitle}
      </div>
      <p style="font-size: 15px; line-height: 1.6;">Please reply to this email with your document.</p>
      <p style="font-size: 15px; line-height: 1.6;">Need help or have questions? You can book a quick call with us anytime:</p>
      <div style="margin: 20px 0;">
        <a href="${bookingUrl}" style="background: #2f7d4f; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">Book a call</a>
      </div>
      <p style="font-size: 13px; color: #6b7670; line-height: 1.5;">If the button doesn't work, copy and paste this link into your browser:<br/><span style="color: #2f7d4f;">${bookingUrl}</span></p>
      <p style="font-size: 14px; margin-top: 32px;">Thank you,<br/><strong>Karli Vazquez-Mendez</strong><br/>Acorn Care, LLC</p>
      <p style="font-size: 11px; color: #9ca39e; margin-top: 32px; padding-top: 16px; border-top: 1px solid #eaecea;">Acorn Care, LLC is not affiliated with any banking institution. This is not investment advice.</p>
    </div>
  `;
}

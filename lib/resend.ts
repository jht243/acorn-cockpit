import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'Acorn Care <intake@intake.layer3labs.io>'; // TODO: switch to karli@acorn-care.com once her domain is verified in Resend
const KARLI = process.env.KARLI_EMAIL || 'karli@acorn-care.com';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://acorn-cockpit.onrender.com';

function intakeLinkEmailHtml(clientName: string, link: string, isReminder = false) {
  const greeting = isReminder
    ? `Just a friendly reminder to complete your Acorn Care intake form when you have a moment.`
    : `Welcome! I'm so glad we're working together. To get started, please complete your secure intake form.`;
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; color: #1f2a24;">
      <div style="border-bottom: 3px solid #2f7d4f; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="font-size: 22px; margin: 0; color: #1f5a39;">Acorn Care</h1>
        <p style="font-size: 13px; color: #6b7670; margin: 4px 0 0;">Concierge Financial Planning</p>
      </div>
      <p style="font-size: 16px;">Hi ${clientName.split(' ')[0]},</p>
      <p style="font-size: 15px; line-height: 1.6;">${greeting}</p>
      <p style="font-size: 15px; line-height: 1.6;">It takes about 15-20 minutes. You can save your progress and finish later — your data is encrypted and secure.</p>
      <div style="margin: 28px 0;">
        <a href="${link}" style="background: #2f7d4f; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">${isReminder ? 'Continue Your Intake' : 'Start Your Intake'}</a>
      </div>
      <p style="font-size: 13px; color: #6b7670; line-height: 1.5;">If the button doesn't work, copy and paste this link into your browser:<br/><span style="color: #2f7d4f;">${link}</span></p>
      <p style="font-size: 14px; margin-top: 32px;">Looking forward to it,<br/><strong>Karli Vazquez-Mendez</strong><br/>Acorn Care, LLC</p>
      <p style="font-size: 11px; color: #9ca39e; margin-top: 32px; padding-top: 16px; border-top: 1px solid #eaecea;">Acorn Care, LLC is not affiliated with any banking institution. This is not investment advice.</p>
    </div>
  `;
}

export async function sendIntakeInvite(clientName: string, clientEmail: string, token: string) {
  const link = `${SITE}/intake?token=${token}`;
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [clientEmail],
      subject: `Welcome to Acorn Care, ${clientName.split(' ')[0]} — your intake form`,
      html: intakeLinkEmailHtml(clientName, link, false),
    });
    if (error) return { success: false, error };
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function sendIntakeReminder(clientName: string, clientEmail: string, token: string) {
  const link = `${SITE}/intake?token=${token}`;
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [clientEmail],
      subject: `Reminder: complete your Acorn Care intake`,
      html: intakeLinkEmailHtml(clientName, link, true),
    });
    if (error) return { success: false, error };
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function sendIntakeCompletionEmail(clientName: string, clientEmail: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [KARLI],
      subject: `New intake completed: ${clientName}`,
      html: `
        <h2>New intake completed</h2>
        <p><strong>${clientName}</strong> (${clientEmail}) has completed their intake form.</p>
        <p><a href="${SITE}/dashboard/clients">View in Cockpit</a></p>
      `,
    });
    if (error) return { success: false, error };
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

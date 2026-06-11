import { Resend } from 'resend';
import { taskReminderHtml, taskReminderSubject } from '@/lib/email-templates';

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'Acorn Care <intake@intake.layer3labs.io>'; // TODO: switch to karli@acorn-care.com once her domain is verified in Resend
const KARLI = process.env.KARLI_EMAIL || 'karli@acorn-care.com';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://acorn-cockpit.onrender.com';
// Calendly booking link used in the post-approval "book a call" email.
const BOOKING_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  process.env.CALENDLY_URL ||
  'https://calendly.com/karli-acorn-care/30min';

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

// Generic branded email wrapper for simple message + optional CTA button.
function messageEmailHtml(clientName: string, bodyHtml: string, cta?: { label: string; link: string }) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; color: #1f2a24;">
      <div style="border-bottom: 3px solid #2f7d4f; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="font-size: 22px; margin: 0; color: #1f5a39;">Acorn Care</h1>
        <p style="font-size: 13px; color: #6b7670; margin: 4px 0 0;">Concierge Financial Planning</p>
      </div>
      <p style="font-size: 16px;">Hi ${clientName.split(' ')[0]},</p>
      ${bodyHtml}
      ${cta ? `
      <div style="margin: 28px 0;">
        <a href="${cta.link}" style="background: #2f7d4f; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">${cta.label}</a>
      </div>
      <p style="font-size: 13px; color: #6b7670; line-height: 1.5;">If the button doesn't work, copy and paste this link into your browser:<br/><span style="color: #2f7d4f;">${cta.link}</span></p>
      ` : ''}
      <p style="font-size: 14px; margin-top: 32px;">Warmly,<br/><strong>Karli Vazquez-Mendez</strong><br/>Acorn Care, LLC</p>
      <p style="font-size: 11px; color: #9ca39e; margin-top: 32px; padding-top: 16px; border-top: 1px solid #eaecea;">Acorn Care, LLC is not affiliated with any banking institution. This is not investment advice.</p>
    </div>
  `;
}

// Sent to the CLIENT immediately after they submit their intake.
export async function sendIntakeConfirmationEmail(clientName: string, clientEmail: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [clientEmail],
      subject: `Thank you for your Acorn Care intake`,
      html: messageEmailHtml(
        clientName,
        `<p style="font-size: 15px; line-height: 1.6;">Thank you for your submission. We're reviewing your intake, and a member of our team will reach out soon.</p>
         <p style="font-size: 15px; line-height: 1.6;">There's nothing more you need to do right now — we'll be in touch shortly with next steps.</p>`,
      ),
    });
    if (error) return { success: false, error };
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

// Sent to the CLIENT to remind them about an open to-do task (e.g. "Send in 2026 tax returns").
export async function sendTaskReminderEmail(clientName: string, clientEmail: string, taskTitle: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [clientEmail],
      subject: taskReminderSubject(taskTitle),
      html: taskReminderHtml(clientName, taskTitle, BOOKING_URL),
    });
    if (error) return { success: false, error };
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

// Sent to the CLIENT once Karli approves the intake — invites them to book a call.
export async function sendBookingInviteEmail(clientName: string, clientEmail: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [clientEmail],
      subject: `Let's find a time to talk — book your Acorn Care call`,
      html: messageEmailHtml(
        clientName,
        `<p style="font-size: 15px; line-height: 1.6;">Thank you — our team has reviewed your documents and we'd love for you to book a call with us at your earliest convenience.</p>
         <p style="font-size: 15px; line-height: 1.6;">Please use the link below to grab a time that works for you.</p>`,
        { label: 'Book a call', link: BOOKING_URL },
      ),
    });
    if (error) return { success: false, error };
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
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

// Sent to the CLIENT with a secure link to upload documents.
export async function sendDocumentUploadRequestEmail(
  clientName: string,
  clientEmail: string,
  uploadLink: string,
  note?: string,
) {
  const bodyHtml = `
    <p style="font-size: 15px; line-height: 1.6;">
      ${note
        ? note.replace(/\n/g, '<br/>')
        : `I'd like to collect a few documents from you. Please use the secure link below to upload them at your convenience.`
      }
    </p>
    <p style="font-size: 15px; line-height: 1.6;">The link is secure and will expire in 30 days.</p>
    <p style="font-size: 13px; color: #6b7670; line-height: 1.5;">Please do not upload medical records.</p>
  `;
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [clientEmail],
      subject: `Documents requested — Acorn Care`,
      html: messageEmailHtml(clientName, bodyHtml, { label: 'Upload documents →', link: uploadLink }),
    });
    if (error) return { success: false, error };
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function sendIntakeCompletionEmail(clientName: string, clientEmail: string, clientId?: string) {
  const clientLink = clientId ? `${SITE}/dashboard/clients/${clientId}` : `${SITE}/dashboard/clients`;
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [KARLI],
      subject: `New intake completed: ${clientName}`,
      html: `
        <h2>New intake completed</h2>
        <p><strong>${clientName}</strong> (${clientEmail}) has completed their intake form.</p>
        <p><a href="${clientLink}" style="background: #2f7d4f; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">Open ${clientName.split(' ')[0]}'s profile</a></p>
        <p style="font-size: 13px; color: #6b7670;">Or paste this link: ${clientLink}</p>
      `,
    });
    if (error) return { success: false, error };
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

'use server'

import { resend } from '@/lib/resend'

const FROM = 'Acorn Care <intake@intake.layer3labs.io>'
const KARLI = process.env.KARLI_EMAIL || 'karli@acorn-care.com'

export async function submitContactForm({
  name,
  email,
  message,
}: {
  name: string
  email: string
  message: string
}) {
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    throw new Error('All fields are required.')
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to: [KARLI],
    replyTo: email,
    subject: `New website inquiry from ${name}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; color: #1f2a24;">
        <div style="border-bottom: 3px solid #2f7d4f; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="font-size: 22px; margin: 0; color: #1f5a39;">New Contact Form Submission</h1>
          <p style="font-size: 13px; color: #6b7670; margin: 4px 0 0;">Acorn Care website</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tr>
            <td style="padding: 8px 0; color: #6b7670; width: 80px; vertical-align: top;">Name</td>
            <td style="padding: 8px 0; font-weight: 600;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7670; vertical-align: top;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2f7d4f;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7670; vertical-align: top;">Message</td>
            <td style="padding: 8px 0; line-height: 1.6;">${message.replace(/\n/g, '<br/>')}</td>
          </tr>
        </table>
        <p style="font-size: 13px; color: #9ca39e; margin-top: 24px; padding-top: 16px; border-top: 1px solid #eaecea;">
          Reply directly to this email to respond to ${name.split(' ')[0]}.
        </p>
      </div>
    `,
  })

  if (error) throw new Error('Failed to send message.')
}

import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendIntakeCompletionEmail(clientName: string, clientEmail: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acorn Care <onboarding@resend.dev>', // Update to Karli's domain later
      to: ['karli@acorn-care.com'], // Send to Karli
      subject: `New Intake Completed: ${clientName}`,
      html: `
        <h2>New Intake Completed</h2>
        <p><strong>${clientName}</strong> (${clientEmail}) has completed their intake form.</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/clients">View in Cockpit</a></p>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

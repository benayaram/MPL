import { Resend } from 'resend';
import { PrayerRequest } from '../models/schema';

export async function sendPrayerRequestNotification(prayerRequest: PrayerRequest, recipientEmail: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log('[Email Notification Skipped - No RESEND_API_KEY]', {
      to: recipientEmail,
      subject: `New Prayer Request: ${prayerRequest.category} - ${prayerRequest.name}`,
      prayerRequest
    });
    return { success: true, simulated: true };
  }

  try {
    const resend = new Resend(apiKey);
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    await resend.emails.send({
      from: `MPL Ministries Notification <${fromAddress}>`,
      to: [recipientEmail],
      subject: `🙏 New Prayer Request (${prayerRequest.category}): ${prayerRequest.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; margin-top: 0;">New Prayer Request Received</h2>
          <p style="color: #475569;">A new prayer request has been submitted on the MPL Ministries website.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px; font-weight: bold; width: 120px; color: #334155;">Name:</td>
              <td style="padding: 8px; color: #0f172a;">${prayerRequest.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #334155;">Contact:</td>
              <td style="padding: 8px; color: #0f172a;">${prayerRequest.contact}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #334155;">Category:</td>
              <td style="padding: 8px; color: #d97706; font-weight: 600;">${prayerRequest.category}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #334155;">Privacy:</td>
              <td style="padding: 8px; color: ${prayerRequest.isPrivate ? '#dc2626' : '#16a34a'}; font-weight: 600;">
                ${prayerRequest.isPrivate ? '🔒 Private / Confidential' : '🌐 Public Wall Eligible'}
              </td>
            </tr>
          </table>

          <div style="margin-top: 20px; background-color: #f8fafc; padding: 16px; border-radius: 6px; border-left: 4px solid #d97706;">
            <h4 style="margin: 0 0 8px 0; color: #0f172a;">Prayer Request Message:</h4>
            <p style="margin: 0; color: #334155; white-space: pre-wrap;">${prayerRequest.message}</p>
          </div>

          <p style="margin-top: 24px; font-size: 13px; color: #94a3b8;">
            Log in to the <a href="https://mplministries.org/admin" style="color: #d97706;">MPL Admin Dashboard</a> to view and update request status.
          </p>
        </div>
      `
    });

    return { success: true, simulated: false };
  } catch (error) {
    console.error('Failed to send Resend email notification:', error);
    return { success: false, error };
  }
}

import { PasswordChangedMail } from "../../types/email";
import { FROM_NAME, FROM_EMAIL } from "../constants";

export const passwordChangedMailTemplate = ({
  userEmail,
  userName,
}: PasswordChangedMail) => ({
  from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
  to: userEmail,
  subject: "Security Alert: Your Password Was Changed",
  html: `
    <div style="margin:0;padding:0;background-color:#f4f6fb;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0"
              style="background:#ffffff;border-radius:12px;overflow:hidden;
                     box-shadow:0 8px 30px rgba(0,0,0,0.08);">
              <tr>
                <td style="background:linear-gradient(135deg,#DC2626,#EF4444);
                           padding:30px;text-align:center;color:#ffffff;">
                  <h1 style="margin:0;font-size:24px;font-weight:700;letter-spacing:-0.5px;">⚡ Spark CRM</h1>
                  <p style="margin:8px 0 0;font-size:14px;opacity:0.9;">Security Alert</p>
                </td>
              </tr>
              <tr>
                <td style="padding:40px 30px;">
                  <h2 style="margin-top:0;color:#111827;font-size:20px;">Password Changed, ${userName}</h2>
                  <p style="color:#4b5563;font-size:14px;line-height:1.6;">
                    Your account password was successfully changed on
                    <strong>${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}</strong>.
                  </p>
                  <div style="margin:20px 0;padding:16px 20px;background:#fef2f2;border-left:4px solid #EF4444;border-radius:6px;">
                    <p style="margin:0;font-size:14px;color:#b91c1c;">
                      <strong>Not you?</strong> If you did not make this change, your account may be compromised.
                      Please contact support immediately and reset your password.
                    </p>
                  </div>
                  <p style="color:#6b7280;font-size:13px;">
                    For your security, all existing sessions have been kept active. We recommend reviewing your active sessions.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background:#f9fafb;padding:20px;text-align:center;border-top:1px solid #f3f4f6;">
                  <p style="margin:0;font-size:12px;color:#9ca3af;">
                    &copy; ${new Date().getFullYear()} Spark CRM. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `,
});

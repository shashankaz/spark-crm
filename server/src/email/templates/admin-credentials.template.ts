import { TenantForAdminMail } from "../../types/email";
import { FROM_NAME, FROM_EMAIL } from "../constants";

export const adminMailTemplate = (
  tenant: TenantForAdminMail,
  randomPassword: string,
) => ({
  from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
  to: tenant.userEmail,
  subject: "Your Admin Account Credentials have been created",
  html: `
    <div style="margin:0;padding:0;background-color:#f4f6fb;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0"
              style="background:#ffffff;border-radius:12px;overflow:hidden;
                     box-shadow:0 8px 30px rgba(0,0,0,0.08);">
              <tr>
                <td style="background:linear-gradient(135deg,#D97706,#B45309);
                           padding:30px;text-align:center;color:#ffffff;">
                  <h1 style="margin:0;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                    ⚡ Spark CRM
                  </h1>
                  <p style="margin:8px 0 0;font-size:14px;opacity:0.9;">
                    Admin Account Credentials
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:40px 30px;">
                  <h2 style="margin-top:0;color:#111827;font-size:20px;">
                    Welcome to Spark CRM!
                  </h2>
                  <p style="color:#4b5563;font-size:14px;line-height:1.6;">
                    Your tenant has been created. Here are your admin credentials:
                  </p>
                  <div style="margin:20px 0;padding:20px;background:#fef3c7;border-radius:10px;text-align:center;border:1px solid #fde68a;">
                    <p style="margin:0 0 8px;color:#374151;"><strong>Email:</strong> ${tenant.userEmail}</p>
                    <p style="margin:0;color:#374151;"><strong>Password:</strong> ${randomPassword}</p>
                  </div>
                  <p style="color:#6b7280;font-size:13px;text-align:center;">
                    Please change your password after logging in.
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

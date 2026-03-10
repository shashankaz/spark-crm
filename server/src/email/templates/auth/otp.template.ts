import { OtpMail } from "../../../types/email";
import { FROM_NAME, FROM_EMAIL } from "../../constants";

export const otpMailTemplate = ({ userEmail, userName, otp }: OtpMail) => ({
  from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
  to: userEmail,
  subject: "Your One-Time Password (OTP) - Spark CRM",
  html: `
    <div style="margin:0;padding:0;background-color:#f4f6fb;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0"
              style="background:#ffffff;border-radius:12px;overflow:hidden;
                     box-shadow:0 8px 30px rgba(0,0,0,0.08);">
              <tr>
                <td style="background:linear-gradient(135deg,#2563EB,#3B82F6);
                           padding:30px;text-align:center;color:#ffffff;">
                  <h1 style="margin:0;font-size:24px;font-weight:700;letter-spacing:-0.5px;">⚡ Spark CRM</h1>
                  <p style="margin:8px 0 0;font-size:14px;opacity:0.9;">Verification Code</p>
                </td>
              </tr>
              <tr>
                <td style="padding:40px 30px;">
                  <h2 style="margin-top:0;color:#111827;font-size:20px;">Hi, ${userName}!</h2>
                  <p style="color:#4b5563;font-size:14px;line-height:1.6;">
                    Use the one-time password below to complete your sign-in. This code is valid for
                    <strong>10 minutes</strong>.
                  </p>
                  <div style="margin:28px 0;text-align:center;">
                    <div style="display:inline-block;padding:16px 40px;background:#eff6ff;
                                border:2px dashed #3B82F6;border-radius:10px;">
                      <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#1d4ed8;">
                        ${otp}
                      </span>
                    </div>
                  </div>
                  <div style="margin:20px 0;padding:16px 20px;background:#fff7ed;border-left:4px solid #f97316;border-radius:6px;">
                    <p style="margin:0;font-size:14px;color:#c2410c;">
                      <strong>Didn't request this?</strong> Ignore this email. Your account remains secure.
                    </p>
                  </div>
                  <p style="color:#6b7280;font-size:13px;">
                    For security, never share this code with anyone. Spark CRM will never ask for your OTP.
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

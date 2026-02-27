import { FROM_NAME, FROM_EMAIL } from "../constants";

export const leadExportMailTemplate = (
  recipientEmail: string,
  fileUrl: string,
  leadCount: number,
) => ({
  from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
  to: recipientEmail,
  subject: "Your Lead Export is Ready",
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
                    Lead Export Ready
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:40px 30px;">
                  <h2 style="margin-top:0;color:#111827;font-size:20px;">
                    Your export is ready! 🎉
                  </h2>
                  <p style="color:#4b5563;font-size:14px;line-height:1.6;">
                    Your requested export of <strong>${leadCount} lead${leadCount !== 1 ? "s" : ""}</strong>
                    has been processed and is ready to download.
                  </p>
                  <p style="color:#4b5563;font-size:14px;line-height:1.6;">
                    Click the button below to download the CSV file. The link will expire in <strong>7 days</strong>.
                  </p>
                  <div style="text-align:center;margin:30px 0;">
                    <a href="${fileUrl}"
                       style="display:inline-block;background:linear-gradient(135deg,#D97706,#B45309);
                              color:#ffffff;text-decoration:none;padding:14px 32px;
                              border-radius:8px;font-size:15px;font-weight:600;">
                      Download CSV
                    </a>
                  </div>
                  <p style="color:#9ca3af;font-size:12px;line-height:1.6;text-align:center;">
                    If the button doesn't work, copy and paste this link into your browser:<br/>
                    <a href="${fileUrl}" style="color:#D97706;word-break:break-all;">${fileUrl}</a>
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

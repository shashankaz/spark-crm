import { FROM_NAME, FROM_EMAIL } from "../../constants";
import { format } from "date-fns";

export const taskReminderMailTemplate = ({
  userEmail,
  userFirstName,
  taskTitle,
  taskDescription,
  dueDate,
}: {
  userEmail: string;
  userFirstName: string;
  taskTitle: string;
  taskDescription?: string;
  dueDate?: string;
}) => ({
  from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
  to: userEmail,
  subject: `⏰ Reminder: ${taskTitle}`,
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
                    Task Reminder
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:40px 30px;">
                  <h2 style="margin-top:0;color:#111827;font-size:20px;">
                    Hello ${userFirstName},
                  </h2>
                  <p style="color:#4b5563;font-size:14px;line-height:1.6;">
                    This is your scheduled reminder for the following task:
                  </p>

                  <div style="margin:24px 0;padding:20px 24px;background:#fef3c7;border-left:4px solid #D97706;border-radius:8px;">
                    <h3 style="margin:0 0 8px;color:#92400e;font-size:16px;">${taskTitle}</h3>
                    ${taskDescription ? `<p style="margin:0 0 12px;color:#78350f;font-size:14px;line-height:1.5;">${taskDescription}</p>` : ""}
                    ${dueDate ? `<p style="margin:0;font-size:13px;color:#92400e;"><strong>Due:</strong> ${format(new Date(dueDate), "PPP p")}</p>` : ""}
                  </div>

                  <p style="color:#6b7280;font-size:13px;line-height:1.6;">
                    Log in to Spark CRM to view and update this task.
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

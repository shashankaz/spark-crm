import { FROM_NAME, FROM_EMAIL } from "../../../utils/constants/email.constant";
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
  subject: `\u23f0 Reminder: ${taskTitle}`,
  html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>Task Reminder - Spark CRM</title>
    <style>
      @media only screen and (max-width: 600px) {
        .email-card {
          width: 100% !important;
          border-radius: 0 !important;
          border-left: none !important;
          border-right: none !important;
        }
        .email-cell {
          padding: 28px 20px !important;
        }
        .email-header-cell {
          padding: 22px 20px !important;
        }
        .email-footer-cell {
          padding: 16px 20px !important;
        }
      }
      @media (prefers-color-scheme: dark) {
        body {
          background-color: #1c1a17 !important;
        }
        .email-outer {
          background-color: #1c1a17 !important;
        }
        .email-card {
          background-color: #27251f !important;
          border-color: #3a3830 !important;
        }
        .email-header-cell {
          background-color: #27251f !important;
          border-color: #3a3830 !important;
        }
        .email-logo {
          color: #e8956a !important;
        }
        .email-tag {
          color: #8b8680 !important;
        }
        .email-greeting {
          color: #f0ede8 !important;
        }
        .email-body-text {
          color: #a09d97 !important;
        }
        .email-task-card {
          background-color: #1f1408 !important;
          border-color: #d97706 !important;
        }
        .email-task-title {
          color: #e8956a !important;
        }
        .email-task-desc {
          color: #a09d97 !important;
        }
        .email-task-meta {
          color: #8b8680 !important;
        }
        .email-note {
          color: #6b6760 !important;
        }
        .email-footer-cell {
          background-color: #1c1a17 !important;
          border-color: #3a3830 !important;
        }
        .email-footer-text {
          color: #6b6760 !important;
        }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f5f3ee">
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="background-color: #f5f3ee; padding: 40px 16px"
      class="email-outer"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            cellpadding="0"
            cellspacing="0"
            style="
              width: 100%;
              max-width: 560px;
              background-color: #ffffff;
              border-radius: 16px;
              border: 1px solid #e5e2dc;
            "
            class="email-card"
          >
            <tr>
              <td
                style="
                  padding: 26px 32px;
                  border-bottom: 1px solid #e5e2dc;
                  background-color: #ffffff;
                  border-radius: 16px 16px 0 0;
                "
                class="email-header-cell"
              >
                <p
                  style="
                    margin: 0 0 4px;
                    font-size: 10px;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #8b8680;
                    font-family: Helvetica, Arial, sans-serif;
                  "
                  class="email-tag"
                >
                  Task Reminder
                </p>
                <p
                  style="
                    margin: 0;
                    font-size: 20px;
                    font-weight: 600;
                    color: #6b3d0f;
                    font-family: Georgia, &quot;Times New Roman&quot;, serif;
                    letter-spacing: -0.3px;
                  "
                  class="email-logo"
                >
                  Spark CRM
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 36px 32px" class="email-cell">
                <h1
                  style="
                    margin: 0 0 10px;
                    font-size: 26px;
                    font-weight: 600;
                    color: #1c1a17;
                    font-family: Georgia, &quot;Times New Roman&quot;, serif;
                    letter-spacing: -0.5px;
                  "
                  class="email-greeting"
                >
                  Hello ${userFirstName},
                </h1>
                <p
                  style="
                    margin: 0 0 28px;
                    font-size: 14px;
                    line-height: 1.75;
                    color: #6b6760;
                    font-family: Helvetica, Arial, sans-serif;
                  "
                  class="email-body-text"
                >
                  This is your scheduled reminder for the following task:
                </p>
                <table
                  role="presentation"
                  cellpadding="0"
                  cellspacing="0"
                  width="100%"
                  style="margin-bottom: 28px"
                >
                  <tr>
                    <td
                      style="padding: 20px 24px; background-color: #fff8ed; border-left: 3px solid #d97706; border-radius: 4px;"
                      class="email-task-card"
                    >
                      <p
                        style="margin: 0 0 ${taskDescription || dueDate ? "10px" : "0"}; font-size: 15px; font-weight: 600; color: #92400e; font-family: Georgia, 'Times New Roman', serif;"
                        class="email-task-title"
                      >${taskTitle}</p>
                      ${taskDescription ? `<p style="margin: 0 0 ${dueDate ? "10px" : "0"}; font-size: 13px; line-height: 1.65; color: #78350f; font-family: Helvetica, Arial, sans-serif;" class="email-task-desc">${taskDescription}</p>` : ""}
                      ${dueDate ? `<p style="margin: 0; font-size: 12px; color: #92400e; font-family: Helvetica, Arial, sans-serif;" class="email-task-meta"><strong>Due:</strong> ${format(new Date(dueDate), "PPP p")}</p>` : ""}
                    </td>
                  </tr>
                </table>
                <p
                  style="
                    margin: 0;
                    font-size: 12px;
                    line-height: 1.65;
                    color: #8b8680;
                    font-family: Helvetica, Arial, sans-serif;
                  "
                  class="email-note"
                >
                  Log in to Spark CRM to view and update this task.
                </p>
              </td>
            </tr>
            <tr>
              <td
                style="
                  padding: 18px 32px;
                  background-color: #faf9f6;
                  border-top: 1px solid #e5e2dc;
                  border-radius: 0 0 16px 16px;
                "
                class="email-footer-cell"
              >
                <p
                  style="
                    margin: 0;
                    font-size: 11px;
                    color: #a09d97;
                    font-family: Helvetica, Arial, sans-serif;
                    text-align: center;
                  "
                  class="email-footer-text"
                >
                  &copy; ${new Date().getFullYear()} Spark CRM
                  &nbsp;&middot;&nbsp; All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
});

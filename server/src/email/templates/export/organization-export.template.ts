import { FROM_NAME, FROM_EMAIL } from "../../../utils/constants/email.constant";

export const organizationExportMailTemplate = (
  recipientEmail: string,
  fileUrl: string,
  count: number,
) => ({
  from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
  to: recipientEmail,
  subject: "Your Organization Export is Ready",
  html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>Organization Export Ready - Spark CRM</title>
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
        .email-body-text-strong {
          color: #d4d1cb !important;
        }
        .email-download-btn {
          background-color: #92400e !important;
        }
        .email-link {
          color: #e8956a !important;
        }
        .email-link-text {
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
                  Organization Export
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
                  Your export is ready
                </h1>
                <p
                  style="
                    margin: 0 0 8px;
                    font-size: 14px;
                    line-height: 1.75;
                    color: #6b6760;
                    font-family: Helvetica, Arial, sans-serif;
                  "
                  class="email-body-text"
                >
                  Your requested export of
                  <strong style="color: #3d3a35" class="email-body-text-strong"
                    >${count} organization${count !== 1 ? "s" : ""}</strong
                  >
                  has been processed and is ready to download.
                </p>
                <p
                  style="
                    margin: 0 0 32px;
                    font-size: 14px;
                    line-height: 1.75;
                    color: #6b6760;
                    font-family: Helvetica, Arial, sans-serif;
                  "
                  class="email-body-text"
                >
                  The link will expire in
                  <strong style="color: #3d3a35" class="email-body-text-strong"
                    >7 days</strong
                  >.
                </p>
                <table
                  role="presentation"
                  cellpadding="0"
                  cellspacing="0"
                  width="100%"
                  style="margin-bottom: 24px"
                >
                  <tr>
                    <td style="text-align: center; padding: 6px 0">
                      <a
                        href="${fileUrl}"
                        style="
                          display: inline-block;
                          background-color: #c27530;
                          color: #ffffff;
                          text-decoration: none;
                          padding: 14px 36px;
                          border-radius: 8px;
                          font-size: 14px;
                          font-weight: 600;
                          font-family: Helvetica, Arial, sans-serif;
                          letter-spacing: 0.02em;
                        "
                        class="email-download-btn"
                        >Download CSV</a
                      >
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
                    text-align: center;
                  "
                  class="email-link-text"
                >
                  If the button doesn&rsquo;t work, copy and paste this link
                  into your browser:<br />
                  <a
                    href="${fileUrl}"
                    style="color: #c27530; word-break: break-all"
                    class="email-link"
                    >${fileUrl}</a
                  >
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

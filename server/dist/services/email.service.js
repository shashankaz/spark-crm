"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
const env_js_1 = require("../config/env.js");
const HOST = env_js_1.env.MAILTRAP_HOST;
const PORT = env_js_1.env.MAILTRAP_PORT;
const USER = env_js_1.env.MAILTRAP_USER;
const PASS = env_js_1.env.MAILTRAP_PASS;
const FROM_NAME = "Spark Team";
const FROM_EMAIL = "hello@spark.com";
const transport = (0, nodemailer_1.createTransport)({
    host: HOST,
    port: Number(PORT),
    secure: false,
    auth: {
        user: USER,
        pass: PASS,
    },
});
const emailTemplates = {
    adminMail: (tenant, randomPassword) => ({
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
                  <td style="background:linear-gradient(135deg,#6366F1,#8B5CF6);
                             padding:30px;text-align:center;color:#ffffff;">
                    <h1 style="margin:0;font-size:24px;font-weight:600;">
                      Campaign Flux
                    </h1>
                    <p style="margin:8px 0 0;font-size:14px;opacity:0.9;">
                      Admin Account Credentials
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:40px 30px;">
                    <h2 style="margin-top:0;color:#111827;font-size:20px;">
                      Welcome to Campaign Flux!
                    </h2>
                    <p style="color:#4b5563;font-size:14px;line-height:1.6;">
                      Your tenant has been created. Here are your admin credentials:
                    </p>
                    <div style="margin:20px 0;padding:20px;background:#eef2ff;border-radius:10px;text-align:center;">
                      <p><strong>Email:</strong> ${tenant.userEmail}</p>
                      <p><strong>Password:</strong> ${randomPassword}</p>
                    </div>
                    <p style="color:#6b7280;font-size:13px;text-align:center;">
                      Please change your password after logging in.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#f9fafb;padding:20px;text-align:center;">
                    <p style="margin:0;font-size:12px;color:#9ca3af;">
                      © ${new Date().getFullYear()} Campaign Flux. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
    }),
};
const emailController = {
    sendAdminMail: (tenant, randomPassword) => __awaiter(void 0, void 0, void 0, function* () {
        const mailOptions = emailTemplates.adminMail(tenant, randomPassword);
        return yield transport.sendMail(mailOptions);
    }),
};
exports.default = emailController;

import {
  TenantForAdminMail,
  UserWelcomeMail,
  PasswordChangedMail,
} from "../types/email";
import {
  adminMailTemplate,
  leadReminderMailTemplate,
  leadExportMailTemplate,
  userWelcomeMailTemplate,
  passwordChangedMailTemplate,
} from "../email/templates";
import { transport } from "../utils/mail-transport";

export const sendAdminMail = async (
  tenant: TenantForAdminMail,
  randomPassword: string,
) => {
  try {
    const mailOptions = adminMailTemplate(tenant, randomPassword);
    return await transport.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending admin mail:", error);
    throw error;
  }
};

export const sendLeadReminderMail = async (
  userEmail: string,
  userName: string,
  leadName: string,
) => {
  try {
    const mailOptions = leadReminderMailTemplate(userEmail, userName, leadName);
    return await transport.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending lead reminder mail:", error);
    throw error;
  }
};

export const sendLeadExportMail = async (
  recipientEmail: string,
  fileUrl: string,
  leadCount: number,
) => {
  try {
    const mailOptions = leadExportMailTemplate(
      recipientEmail,
      fileUrl,
      leadCount,
    );
    return await transport.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending lead export mail:", error);
    throw error;
  }
};

export const sendUserWelcomeMail = async (payload: UserWelcomeMail) => {
  try {
    const mailOptions = userWelcomeMailTemplate(payload);
    return await transport.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending user welcome mail:", error);
    throw error;
  }
};

export const sendPasswordChangedMail = async (payload: PasswordChangedMail) => {
  try {
    const mailOptions = passwordChangedMailTemplate(payload);
    return await transport.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password changed mail:", error);
    throw error;
  }
};

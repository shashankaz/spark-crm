import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { SendMailOptions } from "nodemailer";
import {
  TenantForAdminMail,
  UserWelcomeMail,
  PasswordChangedMail,
  OtpMail,
  TaskReminderJobPayload,
} from "../types/email";
import {
  adminMailTemplate,
  leadReminderMailTemplate,
  leadExportMailTemplate,
  dealExportMailTemplate,
  organizationExportMailTemplate,
  userExportMailTemplate,
  tenantExportMailTemplate,
  userWelcomeMailTemplate,
  passwordChangedMailTemplate,
  otpMailTemplate,
  taskReminderMailTemplate,
} from "../email/templates";
import { sqs } from "../utils/sqs";
import { env } from "../config/env";

const enqueueEmail = async ({
  mailOptions,
}: {
  mailOptions: SendMailOptions;
}): Promise<void> => {
  await sqs.send(
    new SendMessageCommand({
      QueueUrl: env.AWS_SQS_EMAIL_QUEUE_URL,
      MessageBody: JSON.stringify(mailOptions),
    }),
  );
};

export const sendAdminMail = async (
  tenant: TenantForAdminMail,
  randomPassword: string,
) => {
  try {
    const mailOptions = adminMailTemplate(tenant, randomPassword);
    return await enqueueEmail({ mailOptions });
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
    return await enqueueEmail({ mailOptions });
  } catch (error) {
    console.error("Error sending lead reminder mail:", error);
    throw error;
  }
};

export const sendLeadExportMail = async (
  recipientEmail: string,
  fileUrl: string,
  count: number,
) => {
  try {
    const mailOptions = leadExportMailTemplate(recipientEmail, fileUrl, count);
    return await enqueueEmail({ mailOptions });
  } catch (error) {
    console.error("Error sending lead export mail:", error);
    throw error;
  }
};

export const sendDealExportMail = async (
  recipientEmail: string,
  fileUrl: string,
  count: number,
) => {
  try {
    const mailOptions = dealExportMailTemplate(recipientEmail, fileUrl, count);
    return await enqueueEmail({ mailOptions });
  } catch (error) {
    console.error("Error sending deal export mail:", error);
    throw error;
  }
};

export const sendOrganizationExportMail = async (
  recipientEmail: string,
  fileUrl: string,
  count: number,
) => {
  try {
    const mailOptions = organizationExportMailTemplate(
      recipientEmail,
      fileUrl,
      count,
    );
    return await enqueueEmail({ mailOptions });
  } catch (error) {
    console.error("Error sending organization export mail:", error);
    throw error;
  }
};

export const sendUserExportMail = async (
  recipientEmail: string,
  fileUrl: string,
  count: number,
) => {
  try {
    const mailOptions = userExportMailTemplate(recipientEmail, fileUrl, count);
    return await enqueueEmail({ mailOptions });
  } catch (error) {
    console.error("Error sending user export mail:", error);
    throw error;
  }
};

export const sendTenantExportMail = async (
  recipientEmail: string,
  fileUrl: string,
  count: number,
) => {
  try {
    const mailOptions = tenantExportMailTemplate(
      recipientEmail,
      fileUrl,
      count,
    );
    return await enqueueEmail({ mailOptions });
  } catch (error) {
    console.error("Error sending tenant export mail:", error);
    throw error;
  }
};

export const sendUserWelcomeMail = async (payload: UserWelcomeMail) => {
  try {
    const mailOptions = userWelcomeMailTemplate(payload);
    return await enqueueEmail({ mailOptions });
  } catch (error) {
    console.error("Error sending user welcome mail:", error);
    throw error;
  }
};

export const sendPasswordChangedMail = async (payload: PasswordChangedMail) => {
  try {
    const mailOptions = passwordChangedMailTemplate(payload);
    return await enqueueEmail({ mailOptions });
  } catch (error) {
    console.error("Error sending password changed mail:", error);
    throw error;
  }
};

export const sendOtpMail = async (payload: OtpMail) => {
  try {
    const mailOptions = otpMailTemplate(payload);
    return await enqueueEmail({ mailOptions });
  } catch (error) {
    console.error("Error sending OTP mail:", error);
    throw error;
  }
};

export const sendTaskReminderMail = async (payload: TaskReminderJobPayload) => {
  try {
    const mailOptions = taskReminderMailTemplate(payload);
    return await enqueueEmail({ mailOptions });
  } catch (error) {
    console.error("Error sending task reminder mail:", error);
    throw error;
  }
};

import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { Types } from "mongoose";
import { Email } from "../models/email.model";
import { Lead } from "../models/lead.model";
import { AppError } from "../shared/app-error";
import { sqs } from "../utils/sqs";
import { env } from "../config/env";
import { createLeadActionHistoryService } from "./lead-action-history.service";
import {
  FetchEmailsByLeadInput,
  SendEmailForLeadInput,
} from "../types/services/email.service.types";
import { FROM_EMAIL } from "../email/constants";

export const fetchEmailsByLeadService = async ({
  leadId,
  cursor,
  limit,
  search,
}: FetchEmailsByLeadInput) => {
  const countQuery: any = { leadId };

  if (search) {
    countQuery.$or = [
      { subject: { $regex: search, $options: "i" } },
      { to: { $regex: search, $options: "i" } },
    ];
  }

  const whereQuery: any = { ...countQuery };

  if (cursor) {
    whereQuery._id = { $lt: cursor };
  }

  const [totalCount, emails] = await Promise.all([
    Email.countDocuments(countQuery).exec(),
    Email.find(whereQuery).sort({ _id: -1 }).limit(limit).exec(),
  ]);

  return { emails, totalCount };
};

export const sendEmailForLeadService = async ({
  leadId,
  userId,
  userName,
  to,
  subject,
  bodyHtml,
  bodyText,
}: SendEmailForLeadInput) => {
  const lead = await Lead.findById(leadId).exec();
  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  const emailRecord = await Email.create({
    leadId,
    to,
    subject,
    bodyHtml,
    bodyText,
    status: "draft",
  });

  try {
    await sqs.send(
      new SendMessageCommand({
        QueueUrl: env.AWS_SQS_EMAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          from: `"Spark CRM" <${FROM_EMAIL}>`,
          to,
          subject,
          html: bodyHtml,
          text: bodyText,
        }),
      }),
    );

    emailRecord.status = "sent";
    await emailRecord.save();

    await createLeadActionHistoryService({
      leadId: new Types.ObjectId(leadId.toString()),
      actionType: "lead_email_sent",
      message: `Email sent by ${userName} to ${to}: "${subject}"`,
      userId,
      userName,
    });
  } catch (err) {
    emailRecord.status = "failed";
    await emailRecord.save();

    throw new AppError(
      "Failed to send email. It has been saved as failed.",
      500,
    );
  }

  return emailRecord;
};

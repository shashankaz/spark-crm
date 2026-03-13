import { subDays, startOfDay, endOfDay } from "date-fns";
import { SendMessageCommand } from "@aws-sdk/client-sqs";

import { Lead } from "../modules/lead/models/lead.model";
import { IUserDocument } from "../modules/user/models/user.model.types";
import { LeadReminderJobPayload } from "../types/services/lead-reminder.service.types";
import { sqs } from "../utils/aws/sqs";
import { env } from "../config/env";

export const enqueueLeadReminders = async (): Promise<void> => {
  const targetDate = subDays(new Date(), 14);
  const start = startOfDay(targetDate);
  const end = endOfDay(targetDate);

  const leads = await Lead.find({
    status: "new",
    createdAt: { $gte: start, $lte: end },
  }).populate<{ userId: IUserDocument }>("userId");

  let enqueuedCount = 0;

  for (const lead of leads) {
    if (!lead.userId?.email) continue;

    const payload: LeadReminderJobPayload = {
      userEmail: lead.userId.email,
      userFirstName: lead.userId.firstName,
      leadName: `${lead.firstName} ${lead.lastName || ""}`.trim(),
    };

    try {
      await sqs.send(
        new SendMessageCommand({
          QueueUrl: env.AWS_SQS_LEAD_REMINDER_QUEUE_URL,
          MessageBody: JSON.stringify(payload),
        }),
      );

      enqueuedCount++;
    } catch (err) {
      console.error(
        `[LeadReminderJob] Failed to enqueue reminder for lead ${lead._id}:`,
        err,
      );
    }
  }

  console.log(
    `[LeadReminderJob] Enqueued ${enqueuedCount}/${leads.length} lead reminder messages.`,
  );
};

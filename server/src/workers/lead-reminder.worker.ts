import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";

import { sqs } from "../utils/aws/sqs";
import { env } from "../config/env";
import { sendLeadReminderMail } from "../utils/mail/email.helper";
import { LeadReminderJobPayload } from "../types/services/lead-reminder.service.types";
import {
  POLL_INTERVAL_MS,
  VISIBILITY_TIMEOUT,
  MAX_MESSAGES,
} from "./constants";

const processReminderMessage = async (
  payload: LeadReminderJobPayload,
): Promise<void> => {
  await sendLeadReminderMail(
    payload.userEmail,
    payload.userFirstName,
    payload.leadName,
  );
};

export const startLeadReminderWorker = (): void => {
  const poll = async (): Promise<void> => {
    let receivedCount = 0;

    try {
      const response = await sqs.send(
        new ReceiveMessageCommand({
          QueueUrl: env.AWS_SQS_LEAD_REMINDER_QUEUE_URL,
          MaxNumberOfMessages: MAX_MESSAGES,
          WaitTimeSeconds: 20,
          VisibilityTimeout: VISIBILITY_TIMEOUT,
        }),
      );

      const messages = response.Messages ?? [];
      receivedCount = messages.length;

      for (const message of messages) {
        if (!message.Body || !message.ReceiptHandle) continue;

        let payload: LeadReminderJobPayload;

        try {
          payload = JSON.parse(message.Body) as LeadReminderJobPayload;
        } catch {
          console.error(
            "[LeadReminderWorker] Poison message — failed to parse body:",
            message.Body,
          );

          await sqs.send(
            new DeleteMessageCommand({
              QueueUrl: env.AWS_SQS_LEAD_REMINDER_QUEUE_URL,
              ReceiptHandle: message.ReceiptHandle,
            }),
          );
          continue;
        }

        try {
          await processReminderMessage(payload);
        } catch (err) {
          console.error(
            `[LeadReminderWorker] Failed to send reminder to ${payload.userEmail}:`,
            err,
          );
          continue;
        }

        await sqs.send(
          new DeleteMessageCommand({
            QueueUrl: env.AWS_SQS_LEAD_REMINDER_QUEUE_URL,
            ReceiptHandle: message.ReceiptHandle,
          }),
        );
      }
    } catch (err) {
      console.error("[LeadReminderWorker] Poll error:", err);
    }

    setTimeout(poll, receivedCount > 0 ? 0 : POLL_INTERVAL_MS);
  };

  poll();
};

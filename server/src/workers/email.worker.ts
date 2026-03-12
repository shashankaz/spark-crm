import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import { SendMailOptions } from "nodemailer";

import { sqs } from "../utils/aws/sqs";
import { env } from "../config/env";
import { transport } from "../utils/mail/mail-transport";
import {
  POLL_INTERVAL_MS,
  VISIBILITY_TIMEOUT,
  MAX_MESSAGES,
} from "./constants";

const processEmailMessage = async ({
  payload,
}: {
  payload: SendMailOptions;
}): Promise<void> => {
  await transport.sendMail(payload);
};

export const startEmailWorker = (): void => {
  const poll = async (): Promise<void> => {
    let receivedCount = 0;

    try {
      const response = await sqs.send(
        new ReceiveMessageCommand({
          QueueUrl: env.AWS_SQS_EMAIL_QUEUE_URL,
          MaxNumberOfMessages: MAX_MESSAGES,
          WaitTimeSeconds: 20,
          VisibilityTimeout: VISIBILITY_TIMEOUT,
        }),
      );

      const messages = response.Messages ?? [];
      receivedCount = messages.length;

      for (const message of messages) {
        if (!message.Body || !message.ReceiptHandle) continue;

        let payload: SendMailOptions;

        try {
          payload = JSON.parse(message.Body);
        } catch {
          console.error(
            "[EmailWorker] Poison message — failed to parse body:",
            message.Body,
          );

          await sqs.send(
            new DeleteMessageCommand({
              QueueUrl: env.AWS_SQS_EMAIL_QUEUE_URL,
              ReceiptHandle: message.ReceiptHandle,
            }),
          );
          continue;
        }

        try {
          await processEmailMessage({ payload });
        } catch (err) {
          console.error(
            `[EmailWorker] Failed to send email to ${payload?.to}:`,
            err,
          );
          continue;
        }

        await sqs.send(
          new DeleteMessageCommand({
            QueueUrl: env.AWS_SQS_EMAIL_QUEUE_URL,
            ReceiptHandle: message.ReceiptHandle,
          }),
        );
      }
    } catch (err) {
      console.error("[EmailWorker] Poll error:", err);
    }

    setTimeout(poll, receivedCount > 0 ? 0 : POLL_INTERVAL_MS);
  };

  poll();
};

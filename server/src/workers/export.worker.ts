import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import { sqs } from "../utils/aws/sqs";
import { env } from "../config/env";
import { ExportJobPayload } from "../utils/export/export.types";
import {
  POLL_INTERVAL_MS,
  VISIBILITY_TIMEOUT,
  MAX_MESSAGES,
} from "./constants";
import {
  processLeadExport,
  processDealExport,
  processOrganizationExport,
  processUserExport,
  processTenantExport,
} from "./export";

const processExportJob = async (payload: ExportJobPayload): Promise<void> => {
  switch (payload.type) {
    case "lead":
      return processLeadExport(payload);
    case "deal":
      return processDealExport(payload);
    case "organization":
      return processOrganizationExport(payload);
    case "user":
      return processUserExport(payload);
    case "tenant":
      return processTenantExport(payload);
    default: {
      const exhaustive: never = payload;
      console.warn("[ExportWorker] Unknown export type:", exhaustive);
    }
  }
};

export const startExportWorker = (): void => {
  const poll = async (): Promise<void> => {
    let receivedCount = 0;

    try {
      const response = await sqs.send(
        new ReceiveMessageCommand({
          QueueUrl: env.AWS_SQS_EXPORT_QUEUE_URL,
          MaxNumberOfMessages: MAX_MESSAGES,
          WaitTimeSeconds: 20,
          VisibilityTimeout: VISIBILITY_TIMEOUT,
        }),
      );

      const messages = response.Messages ?? [];
      receivedCount = messages.length;

      for (const message of messages) {
        if (!message.Body || !message.ReceiptHandle) continue;

        let payload: ExportJobPayload;

        try {
          payload = JSON.parse(message.Body) as ExportJobPayload;
        } catch {
          console.error(
            "[ExportWorker] Poison message — failed to parse body:",
            message.Body,
          );
          await sqs.send(
            new DeleteMessageCommand({
              QueueUrl: env.AWS_SQS_EXPORT_QUEUE_URL,
              ReceiptHandle: message.ReceiptHandle,
            }),
          );
          continue;
        }

        try {
          await processExportJob(payload);
        } catch (err) {
          console.error("[ExportWorker] Failed to process job:", err);
          continue;
        }

        await sqs.send(
          new DeleteMessageCommand({
            QueueUrl: env.AWS_SQS_EXPORT_QUEUE_URL,
            ReceiptHandle: message.ReceiptHandle,
          }),
        );
      }
    } catch (err) {
      console.error("[ExportWorker] Poll error:", err);
    }

    setTimeout(poll, receivedCount > 0 ? 0 : POLL_INTERVAL_MS);
  };

  poll();
};

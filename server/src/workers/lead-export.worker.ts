import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { stringify } from "csv-stringify/sync";
import { randomUUID } from "crypto";
import { formatDate } from "date-fns";

import { sqs } from "../utils/sqs";
import { s3 } from "../utils/s3";
import { env } from "../config/env";
import { Lead } from "../models/lead.model";
import { sendLeadExportMail } from "../services/email.service";
import { LeadExportJobPayload } from "../types/services/lead-export.service.types";
import {
  POLL_INTERVAL_MS,
  VISIBILITY_TIMEOUT,
  MAX_MESSAGES,
} from "./constants";

const processExportJob = async (
  payload: LeadExportJobPayload,
): Promise<void> => {
  const { tenantId, leadIds, recipientEmail } = payload;

  const leads = await Lead.find({
    _id: { $in: leadIds },
    tenantId,
  }).lean();

  if (leads.length === 0) {
    console.warn("[LeadExportWorker] No leads found for payload:", payload);
    return;
  }

  const rows = leads.map((lead) => ({
    ID: String(lead._id),
    "First Name": lead.firstName ?? "",
    "Last Name": lead.lastName ?? "",
    Email: lead.email ?? "",
    Mobile: lead.mobile ?? "",
    Organization: lead.orgName ?? "",
    Gender: lead.gender ?? "",
    Source: lead.source ?? "",
    Score: lead.score ?? 0,
    Status: lead.status ?? "",
    "Created At": lead.createdAt
      ? formatDate(lead.createdAt, "dd/MM/yyyy")
      : "",
    "Updated At": lead.updatedAt
      ? formatDate(lead.updatedAt, "dd/MM/yyyy")
      : "",
  }));

  const csvBuffer = Buffer.from(stringify(rows, { header: true }), "utf-8");

  const s3Key = `exports/leads/${tenantId}/${randomUUID()}-leads.csv`;

  await s3.send(
    new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      Body: csvBuffer,
      ContentType: "text/csv",
      ContentDisposition: `attachment; filename="leads-export.csv"`,
    }),
  );

  const signedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
    }),
    { expiresIn: 60 * 60 * 24 * 7 }, // 7 days
  );

  await sendLeadExportMail(recipientEmail, signedUrl, leads.length);
};

export const startLeadExportWorker = (): void => {
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

        let payload: LeadExportJobPayload;

        try {
          payload = JSON.parse(message.Body) as LeadExportJobPayload;
        } catch {
          console.error(
            "[LeadExportWorker] Poison message — failed to parse body:",
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
          console.error("[LeadExportWorker] Failed to process job:", err);
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
      console.error("[LeadExportWorker] Poll error:", err);
    }

    setTimeout(poll, receivedCount > 0 ? 0 : POLL_INTERVAL_MS);
  };

  poll();
};

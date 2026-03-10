import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqs } from "../utils/sqs";
import { env } from "../config/env";
import {
  EnqueueDealExportInput,
  EnqueueOrganizationExportInput,
  EnqueueUserExportInput,
  EnqueueTenantExportInput,
} from "../types/services/export.service.types";

export const enqueueDealExportService = async ({
  tenantId,
  dealIds,
  recipientEmail,
}: EnqueueDealExportInput) => {
  const messageBody = JSON.stringify({
    type: "deal",
    tenantId,
    dealIds,
    recipientEmail,
  });

  const command = new SendMessageCommand({
    QueueUrl: env.AWS_SQS_EXPORT_QUEUE_URL,
    MessageBody: messageBody,
  });

  const result = await sqs.send(command);
  return { messageId: result.MessageId };
};

export const enqueueOrganizationExportService = async ({
  tenantId,
  organizationIds,
  recipientEmail,
}: EnqueueOrganizationExportInput) => {
  const messageBody = JSON.stringify({
    type: "organization",
    tenantId,
    organizationIds,
    recipientEmail,
  });

  const command = new SendMessageCommand({
    QueueUrl: env.AWS_SQS_EXPORT_QUEUE_URL,
    MessageBody: messageBody,
  });

  const result = await sqs.send(command);
  return { messageId: result.MessageId };
};

export const enqueueUserExportService = async ({
  tenantId,
  userIds,
  recipientEmail,
}: EnqueueUserExportInput) => {
  const messageBody = JSON.stringify({
    type: "user",
    tenantId,
    userIds,
    recipientEmail,
  });

  const command = new SendMessageCommand({
    QueueUrl: env.AWS_SQS_EXPORT_QUEUE_URL,
    MessageBody: messageBody,
  });

  const result = await sqs.send(command);
  return { messageId: result.MessageId };
};

export const enqueueTenantExportService = async ({
  tenantIds,
  recipientEmail,
}: EnqueueTenantExportInput) => {
  const messageBody = JSON.stringify({
    type: "tenant",
    tenantIds,
    recipientEmail,
  });

  const command = new SendMessageCommand({
    QueueUrl: env.AWS_SQS_EXPORT_QUEUE_URL,
    MessageBody: messageBody,
  });

  const result = await sqs.send(command);
  return { messageId: result.MessageId };
};

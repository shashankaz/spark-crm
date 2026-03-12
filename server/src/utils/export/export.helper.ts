import { SendMessageCommand } from "@aws-sdk/client-sqs";
import {
  EnqueueDealExportInput,
  EnqueueOrganizationExportInput,
  EnqueueUserExportInput,
  EnqueueTenantExportInput,
  EnqueueLeadExportInput,
} from "./export.types";
import { sqs } from "../aws/sqs";
import { env } from "../../config/env";

export const enqueueLeadExportService = async ({
  tenantId,
  leadIds,
  recipientEmail,
}: EnqueueLeadExportInput) => {
  const messageBody = JSON.stringify({
    type: "lead",
    tenantId,
    leadIds,
    recipientEmail,
  });

  const command = new SendMessageCommand({
    QueueUrl: env.AWS_SQS_EXPORT_QUEUE_URL,
    MessageBody: messageBody,
  });

  const result = await sqs.send(command);
  return { messageId: result.MessageId };
};

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

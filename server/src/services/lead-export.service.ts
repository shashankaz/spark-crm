import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqs } from "../utils/sqs";
import { env } from "../config/env";
import { EnqueueLeadExportInput } from "../types/services/lead-export.service.types";

export const enqueueLeadExportService = async ({
  tenantId,
  leadIds,
  recipientEmail,
}: EnqueueLeadExportInput) => {
  const messageBody = JSON.stringify({ tenantId, leadIds, recipientEmail });

  const command = new SendMessageCommand({
    QueueUrl: env.AWS_SQS_EXPORT_QUEUE_URL,
    MessageBody: messageBody,
  });

  const result = await sqs.send(command);

  return { messageId: result.MessageId };
};

import { Attachment } from "../models/attachment.model";
import { Lead } from "../models/lead.model";
import { AppError } from "../shared/app-error";
import { createLeadActionHistoryService } from "./lead-action-history.service";
import {
  FetchAttachmentsByLeadInput,
  CreateAttachmentForLeadInput,
} from "../types/services/attachment.service.types";

export const fetchAttachmentsByLeadService = async ({
  leadId,
  cursor,
  limit = 10,
  search,
}: FetchAttachmentsByLeadInput) => {
  const countQuery: any = { leadId };
  if (search) {
    countQuery.fileName = { $regex: search, $options: "i" };
  }

  const whereQuery = { ...countQuery };
  if (cursor) {
    whereQuery._id = { $gt: cursor };
  }

  const [totalCount, attachments] = await Promise.all([
    Attachment.countDocuments(countQuery).exec(),
    Attachment.find(whereQuery).sort({ _id: -1 }).limit(limit).exec(),
  ]);

  return { attachments, totalCount };
};

export const createAttachmentForLeadService = async ({
  leadId,
  userId,
  userName,
  fileName,
  fileUrl,
  fileType,
}: CreateAttachmentForLeadInput) => {
  const lead = await Lead.findById(leadId).exec();
  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  const newAttachment = await Attachment.create({
    leadId,
    fileName,
    fileUrl,
    fileType,
  });

  await createLeadActionHistoryService({
    leadId,
    actionType: "lead_attachment_added",
    message: `Attachment added by ${userName}: "${fileName}"`,
    userId,
    userName,
  });

  return newAttachment;
};

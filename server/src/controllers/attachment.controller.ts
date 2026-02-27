import { Request, Response } from "express";
import {
  fetchAttachmentsByLeadService,
  createAttachmentForLeadService,
} from "../services/attachment.service";
import { AppError } from "../shared/app-error";
import { sendSuccess } from "../shared/api-response";
import { asyncHandler } from "../shared/async-handler";

export const getAllAttachmentsByLeadId = asyncHandler(
  async (req: Request, res: Response) => {
    const { leadId } = req.params;
    if (!leadId) {
      throw new AppError("Lead ID is required", 400);
    }

    const cursor = req.query.cursor as string | undefined;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;

    const { attachments, totalCount } = await fetchAttachmentsByLeadService({
      leadId,
      cursor,
      limit,
      search,
    });

    sendSuccess(res, 200, "Attachments retrieved successfully", {
      attachments,
      totalCount,
    });
  },
);

export const createAttachmentForLead = asyncHandler(
  async (req: Request, res: Response) => {
    const { leadId } = req.params;
    if (!leadId) {
      throw new AppError("Lead ID is required", 400);
    }

    const { tenantId, _id: userId, firstName: userName } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const { fileName, fileUrl, fileType } = req.body;
    if (!fileName || !fileUrl) {
      throw new AppError("fileName and fileUrl are required", 400);
    }

    const newAttachment = await createAttachmentForLeadService({
      leadId,
      userId,
      userName,
      fileName,
      fileUrl,
      fileType,
    });
    if (!newAttachment) {
      throw new AppError("Failed to create attachment", 400);
    }

    sendSuccess(res, 201, "Attachment created successfully", {
      attachment: newAttachment,
    });
  },
);

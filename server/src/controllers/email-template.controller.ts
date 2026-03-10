import { Request, Response } from "express";
import { Types } from "mongoose";
import { AppError } from "../shared/app-error";
import { sendSuccess } from "../shared/api-response";
import { asyncHandler } from "../shared/async-handler";
import {
  fetchEmailTemplatesService,
  getEmailTemplateByIdService,
  createEmailTemplateService,
  updateEmailTemplateService,
  deleteEmailTemplateService,
} from "../services/email-template.service";

export const getEmailTemplates = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, _id: userId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const search = req.query.search as string | undefined;
    const tag = req.query.tag as string | undefined;

    const templates = await fetchEmailTemplatesService({
      tenantId,
      userId,
      search,
      tag,
    });

    sendSuccess(res, 200, "Email templates retrieved successfully", {
      templates,
    });
  },
);

export const getEmailTemplateById = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const id = req.params.id as unknown as Types.ObjectId;
    if (!id) {
      throw new AppError("Template ID is required", 400);
    }

    const template = await getEmailTemplateByIdService({ id, tenantId });

    sendSuccess(res, 200, "Email template retrieved successfully", {
      template,
    });
  },
);

export const createEmailTemplate = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, _id: userId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const { name, subject, bodyHtml, tags } = req.body;

    if (!name || !subject || !bodyHtml) {
      throw new AppError("Name, subject, and body are required", 400);
    }

    const template = await createEmailTemplateService({
      name,
      subject,
      bodyHtml,
      tags,
      tenantId,
      userId,
    });

    sendSuccess(res, 201, "Email template created successfully", { template });
  },
);

export const updateEmailTemplate = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, _id: userId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const id = req.params.id as unknown as Types.ObjectId;
    if (!id) {
      throw new AppError("Template ID is required", 400);
    }

    const { name, subject, bodyHtml, tags } = req.body;

    const template = await updateEmailTemplateService({
      id,
      tenantId,
      userId,
      name,
      subject,
      bodyHtml,
      tags,
    });

    sendSuccess(res, 200, "Email template updated successfully", { template });
  },
);

export const deleteEmailTemplate = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, _id: userId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const id = req.params.id as unknown as Types.ObjectId;
    if (!id) {
      throw new AppError("Template ID is required", 400);
    }

    await deleteEmailTemplateService({ id, tenantId, userId });

    sendSuccess(res, 200, "Email template deleted successfully", {});
  },
);

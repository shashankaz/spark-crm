import { Request, Response } from "express";
import { Types } from "mongoose";
import { AppError } from "../shared/app-error";
import { sendSuccess } from "../shared/api-response";
import { asyncHandler } from "../shared/async-handler";
import {
  generateWebhookTokenService,
  listWebhookTokensService,
  revokeWebhookTokenService,
  deleteWebhookTokenService,
  createWebhookLeadService,
} from "../services/webhook.service";

export const generateWebhookToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, _id: createdBy } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const { name } = req.body;
    if (!name || typeof name !== "string") {
      throw new AppError("Token name is required", 400);
    }

    const { rawToken, webhookToken } = await generateWebhookTokenService({
      tenantId,
      name: name.trim(),
      createdBy,
    });

    sendSuccess(res, 201, "Webhook token generated successfully", {
      rawToken,
      webhookToken,
    });
  },
);

export const listWebhookTokens = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const tokens = await listWebhookTokensService(tenantId);

    sendSuccess(res, 200, "Webhook tokens retrieved successfully", { tokens });
  },
);

export const revokeWebhookToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const id = req.params.id as unknown as Types.ObjectId;
    if (!id) {
      throw new AppError("Token ID is required", 400);
    }

    const token = await revokeWebhookTokenService({ id, tenantId });

    sendSuccess(res, 200, "Webhook token revoked successfully", {
      token,
    });
  },
);

export const deleteWebhookToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const id = req.params.id as unknown as Types.ObjectId;
    if (!id) {
      throw new AppError("Token ID is required", 400);
    }

    await deleteWebhookTokenService({ id, tenantId });

    sendSuccess(res, 200, "Webhook token deleted successfully", { id });
  },
);

export const createLeadFromWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = req.webhookTenantId;
    if (!tenantId) {
      throw new AppError("Tenant resolution failed", 500);
    }

    const { firstName, lastName, email, mobile, gender, source } = req.body;

    if (!firstName || !email || !mobile || !gender) {
      throw new AppError(
        "firstName, email, mobile, and gender are required",
        400,
      );
    }

    const validGenders = ["male", "female", "other"];
    if (!validGenders.includes(gender)) {
      throw new AppError(
        `gender must be one of: ${validGenders.join(", ")}`,
        400,
      );
    }

    const lead = await createWebhookLeadService({
      tenantId,
      firstName,
      lastName,
      email,
      mobile,
      gender,
      source,
    });

    sendSuccess(res, 201, "Lead submitted successfully", {
      lead: {
        _id: lead._id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        status: lead.status,
        createdAt: lead.createdAt,
      },
    });
  },
);

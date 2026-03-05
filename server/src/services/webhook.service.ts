import { Types } from "mongoose";
import { WebhookToken } from "../models/webhook-token.model";
import { User } from "../models/user.model";
import { AppError } from "../shared/app-error";
import { createLeadService } from "./lead.service";
import { generateToken, hashToken } from "../utils/crypto-token";
import {
  GenerateWebhookTokenInput,
  RevokeWebhookTokenInput,
  CreateWebhookLeadInput,
} from "../types/services/webhook.service.types";

export const generateWebhookTokenService = async ({
  tenantId,
  name,
  createdBy,
}: GenerateWebhookTokenInput) => {
  const rawToken = generateToken();
  const tokenHash = hashToken(rawToken);

  const webhookToken = await WebhookToken.create({
    tenantId,
    name,
    tokenHash,
    isActive: true,
    createdBy,
  });

  return { rawToken, webhookToken };
};

export const validateWebhookTokenService = async (token: string) => {
  const tokenHash = hashToken(token);
  const webhookToken = await WebhookToken.findOne({
    tokenHash,
    isActive: true,
  })
    .select("+tokenHash")
    .exec();

  if (!webhookToken) {
    throw new AppError("Invalid or inactive API key", 401);
  }

  webhookToken.lastUsedAt = new Date();
  await webhookToken.save();

  return webhookToken;
};

export const listWebhookTokensService = async (tenantId: Types.ObjectId) => {
  return await WebhookToken.find({ tenantId }).sort({ createdAt: -1 }).exec();
};

export const revokeWebhookTokenService = async ({
  id,
  tenantId,
}: RevokeWebhookTokenInput) => {
  const token = await WebhookToken.findOne({ _id: id, tenantId }).exec();
  if (!token) {
    throw new AppError("Webhook token not found", 404);
  }

  token.isActive = false;
  return await token.save();
};

export const deleteWebhookTokenService = async ({
  id,
  tenantId,
}: RevokeWebhookTokenInput) => {
  const token = await WebhookToken.findOneAndDelete({
    _id: id,
    tenantId,
  }).exec();
  if (!token) {
    throw new AppError("Webhook token not found", 404);
  }

  return token;
};

export const createWebhookLeadService = async ({
  tenantId,
  firstName,
  lastName,
  email,
  mobile,
  gender,
  source,
}: CreateWebhookLeadInput) => {
  const assignedUser = await User.findOne({ tenantId }).exec();

  if (!assignedUser) {
    throw new AppError("No users found for this tenant", 500);
  }

  return await createLeadService({
    tenantId,
    userId: assignedUser._id,
    userName: assignedUser.firstName,
    firstName,
    lastName,
    email,
    mobile,
    gender,
    source: source || "webhook",
  });
};

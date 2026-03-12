import { Request, Response } from "express";
import { Types } from "mongoose";
import { AppError } from "../../shared/app-error";
import { sendSuccess } from "../../shared/api-response";
import { asyncHandler } from "../../shared/async-handler";
import {
  createGroupService,
  fetchGroupsService,
  getGroupByIdService,
  updateGroupService,
  deleteGroupService,
  sendCampaignToGroupService,
} from "./services/group.service";

export const createGroup = asyncHandler(async (req: Request, res: Response) => {
  const { tenantId, _id: userId } = req.user;
  if (!tenantId) {
    throw new AppError("Tenant ID is missing in user data", 400);
  }

  const { name, description, leads } = req.body;

  if (!name || !leads || !Array.isArray(leads) || leads.length === 0) {
    throw new AppError("Group name and leads are required", 400);
  }

  const group = await createGroupService({
    name,
    description,
    tenantId,
    userId,
    leads,
  });

  sendSuccess(res, 201, "Group created successfully", { group });
});

export const getGroups = asyncHandler(async (req: Request, res: Response) => {
  const { tenantId, _id: userId } = req.user;
  if (!tenantId) {
    throw new AppError("Tenant ID is missing in user data", 400);
  }

  const { groups, totalCount } = await fetchGroupsService({
    tenantId,
    userId,
  });

  sendSuccess(res, 200, "Groups retrieved successfully", {
    groups,
    totalCount,
  });
});

export const getGroup = asyncHandler(async (req: Request, res: Response) => {
  const { tenantId } = req.user;
  if (!tenantId) {
    throw new AppError("Tenant ID is missing in user data", 400);
  }

  const id = req.params.id as unknown as Types.ObjectId;
  if (!id) {
    throw new AppError("Group id is required", 400);
  }

  const group = await getGroupByIdService({ id, tenantId });

  sendSuccess(res, 200, "Group retrieved successfully", { group });
});

export const updateGroup = asyncHandler(async (req: Request, res: Response) => {
  const { tenantId } = req.user;
  if (!tenantId) {
    throw new AppError("Tenant ID is missing in user data", 400);
  }

  const id = req.params.id as unknown as Types.ObjectId;
  if (!id) {
    throw new AppError("Group id is required", 400);
  }

  const { name, description, leads } = req.body;

  const group = await updateGroupService({
    id,
    tenantId,
    name,
    description,
    leads,
  });

  sendSuccess(res, 200, "Group updated successfully", { group });
});

export const deleteGroup = asyncHandler(async (req: Request, res: Response) => {
  const { tenantId } = req.user;
  if (!tenantId) {
    throw new AppError("Tenant ID is missing in user data", 400);
  }

  const id = req.params.id as unknown as Types.ObjectId;
  if (!id) {
    throw new AppError("Group id is required", 400);
  }

  await deleteGroupService({ id, tenantId });

  sendSuccess(res, 200, "Group deleted successfully", {});
});

export const sendCampaign = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, _id: userId, firstName: userName } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const id = req.params.id as unknown as Types.ObjectId;
    if (!id) {
      throw new AppError("Group id is required", 400);
    }

    const { subject, bodyHtml, bodyText } = req.body;

    if (!subject) {
      throw new AppError("Subject is required", 400);
    }
    if (!bodyHtml) {
      throw new AppError("Email body is required", 400);
    }

    const result = await sendCampaignToGroupService({
      tenantId,
      groupId: id,
      userId,
      userName,
      subject,
      bodyHtml,
      bodyText: bodyText || bodyHtml.replace(/<[^>]+>/g, ""),
    });

    sendSuccess(res, 200, "Campaign started successfully", result);
  },
);

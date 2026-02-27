import { Request, Response } from "express";
import { Types } from "mongoose";
import {
  fetchCommentsByLeadService,
  createCommentForLeadService,
} from "../services/comment.service";
import { AppError } from "../shared/app-error";
import { sendSuccess } from "../shared/api-response";
import { asyncHandler } from "../shared/async-handler";

export const getAllCommentsByLeadId = asyncHandler(
  async (req: Request, res: Response) => {
    const { leadId } = req.params;
    if (!leadId) {
      throw new AppError("Lead ID is required", 400);
    }

    const cursor = req.query.cursor as Types.ObjectId | undefined;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;

    const { comments, totalCount } = await fetchCommentsByLeadService({
      leadId,
      cursor,
      limit,
      search,
    });

    sendSuccess(res, 200, "Comments retrieved successfully", {
      comments,
      totalCount,
    });
  },
);

export const createCommentForLead = asyncHandler(
  async (req: Request, res: Response) => {
    const { leadId } = req.params;
    if (!leadId) {
      throw new AppError("Lead ID is required", 400);
    }

    const { tenantId, _id: userId, firstName: userName } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const { comment } = req.body;
    if (!comment) {
      throw new AppError("Comment is required", 400);
    }

    const newComment = await createCommentForLeadService({
      tenantId,
      leadId,
      userId,
      userName,
      comment,
    });
    if (!newComment) {
      throw new AppError("Failed to create comment", 400);
    }

    sendSuccess(res, 201, "Comment created successfully", {
      comment: newComment,
    });
  },
);

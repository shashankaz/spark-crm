import { Comment } from "../models/comment.model.js";
import { Lead } from "../models/lead.model.js";
import { AppError } from "../utils/app-error.js";
import { createLeadActionHistoryService } from "./lead-action-history.service.js";

export const fetchCommentsByLeadService = async ({
  leadId,
  cursor,
  limit,
  search,
}) => {
  const countQuery = { leadId };
  if (search) {
    countQuery.comment = { $regex: search, $options: "i" };
  }

  const whereQuery = { ...countQuery };
  if (cursor) {
    whereQuery._id = { $gt: cursor };
  }

  const [totalCount, comments] = await Promise.all([
    Comment.countDocuments(countQuery).exec(),
    Comment.find(whereQuery).sort({ createdAt: -1 }).limit(limit).exec(),
  ]);

  return { comments, totalCount };
};

export const createCommentForLeadService = async ({
  tenantId,
  leadId,
  userId,
  userName,
  comment,
}) => {
  const lead = await Lead.findById(leadId).exec();
  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  const newComment = await Comment.create({
    tenantId,
    leadId,
    comment,
  });

  await createLeadActionHistoryService({
    leadId,
    actionType: "lead_commented",
    message: `Comment added by ${userName}: "${comment}"`,
    userId,
    userName,
  });

  return newComment;
};

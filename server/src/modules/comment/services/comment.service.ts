import { Comment } from "../models/comment.model";
import { Lead } from "../../lead/models/lead.model";
import { AppError } from "../../../shared/app-error";
import { createLeadActionHistoryService } from "../../../services/lead-action-history.service";
import {
  IFetchCommentsByLeadInput,
  ICreateCommentForLeadInput,
} from "./comment.service.types";

export const fetchCommentsByLeadService = async ({
  leadId,
  cursor,
  limit,
  search,
}: IFetchCommentsByLeadInput) => {
  const countQuery: any = { leadId };
  if (search) {
    countQuery.comment = { $regex: search, $options: "i" };
  }

  const whereQuery = { ...countQuery };
  if (cursor) {
    whereQuery._id = { $gt: cursor };
  }

  const [totalCount, comments] = await Promise.all([
    Comment.countDocuments(countQuery).exec(),
    Comment.find(whereQuery).sort({ _id: -1 }).limit(limit).exec(),
  ]);

  return { comments, totalCount };
};

export const createCommentForLeadService = async ({
  leadId,
  userId,
  userName,
  comment,
}: ICreateCommentForLeadInput) => {
  const lead = await Lead.findById(leadId).exec();
  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  const newComment = await Comment.create({
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

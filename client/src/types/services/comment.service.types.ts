import type { IComment } from "@/types/domain";

/**
 * API response types
 */

export type CommentsData = {
  comments: IComment[];
  totalCount: number;
};

export type CommentData = {
  comment: IComment;
};

/**
 * Request types
 */

export type GetAllCommentsByLeadIdRequest = {
  leadId: string;
  cursor?: string;
  limit?: number;
  search?: string;
};

export type CreateCommentForLeadRequest = {
  leadId: string;
  comment: string;
};

/**
 * Response types
 */

export type GetAllCommentsByLeadIdResponse = {
  message: string;
  comments: IComment[];
  totalCount: number;
};

export type CreateCommentForLeadResponse = {
  message: string;
  comment: IComment;
};

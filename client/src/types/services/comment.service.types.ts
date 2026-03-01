import type { Comment } from "@/types/domain";

export type CommentsData = {
  comments: Comment[];
  totalCount: number;
};

export type CommentData = {
  comment: Comment;
};

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

export type GetAllCommentsByLeadIdResponse = {
  message: string;
  comments: Comment[];
  totalCount: number;
};

export type CreateCommentForLeadResponse = {
  message: string;
  comment: Comment;
};

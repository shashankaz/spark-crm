import type { IComment } from "@/types/domain";

export type CommentsData = {
  comments: IComment[];
  totalCount: number;
};

export type CommentData = {
  comment: IComment;
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
  comments: IComment[];
  totalCount: number;
};

export type CreateCommentForLeadResponse = {
  message: string;
  comment: IComment;
};

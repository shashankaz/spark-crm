import { api } from "@/api";
import { buildQueryParams } from "@/api/query-params";
import type { Comment } from "@/types";

export type GetAllCommentsByLeadIdResponse = {
  message: string;
  comments: Comment[];
  totalCount: number;
};

export type CreateCommentForLeadResponse = {
  message: string;
  comment: Comment;
};

export const getAllCommentsByLeadId = async ({
  leadId,
  cursor,
  limit = 10,
  search,
}: {
  leadId: string;
  cursor?: string;
  limit?: number;
  search?: string;
}): Promise<GetAllCommentsByLeadIdResponse> => {
  try {
    const query = buildQueryParams({ cursor, limit, search });
    const response = await api.get(`/comment/${leadId}${query ? `?${query}` : ""}`);

    const { message } = response.data;
    const { comments, totalCount } = response.data.data;

    return { message, comments, totalCount };
  } catch (error) {
    console.error("Get all comments by lead ID error:", error);
    throw error;
  }
};

export const createCommentForLead = async ({
  leadId,
  comment,
}: {
  leadId: string;
  comment: string;
}): Promise<CreateCommentForLeadResponse> => {
  try {
    const response = await api.post(`/comment/${leadId}`, {
      comment,
    });

    const { message } = response.data;
    const { comment: createdComment } = response.data.data;

    return { message, comment: createdComment };
  } catch (error) {
    console.error("Create comment error:", error);
    throw error;
  }
};

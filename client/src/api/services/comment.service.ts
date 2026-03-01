import { api } from "@/api";
import { withApiHandler } from "@/api/api-handler";
import { buildQueryParams } from "@/api/query-params";
import type { ApiResponse } from "@/api/api-response";
import type {
  CommentData,
  CommentsData,
  CreateCommentForLeadRequest,
  CreateCommentForLeadResponse,
  GetAllCommentsByLeadIdRequest,
  GetAllCommentsByLeadIdResponse,
} from "@/types/services";

export const getAllCommentsByLeadId = async (
  params: GetAllCommentsByLeadIdRequest,
): Promise<GetAllCommentsByLeadIdResponse> =>
  withApiHandler(async () => {
    const { leadId, cursor, limit = 10, search } = params;
    const query = buildQueryParams({ cursor, limit, search });
    const response = await api.get<ApiResponse<CommentsData>>(
      `/comment/${leadId}${query ? `?${query}` : ""}`,
    );

    const { message, data } = response.data;

    return {
      message,
      comments: data.comments,
      totalCount: data.totalCount,
    };
  });

export const createCommentForLead = async (
  params: CreateCommentForLeadRequest,
): Promise<CreateCommentForLeadResponse> =>
  withApiHandler(async () => {
    const { leadId, comment } = params;
    const response = await api.post<ApiResponse<CommentData>>(
      `/comment/${leadId}`,
      { comment },
    );

    const { message, data } = response.data;

    return {
      message,
      comment: data.comment,
    };
  });

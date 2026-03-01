import { api } from "@/api";
import { withApiHandler } from "@/api/api-handler";
import { buildQueryParams } from "@/api/query-params";
import type { ApiResponse } from "@/api/api-response";
import type {
  CallData,
  CallsData,
  CreateCallForLeadRequest,
  CreateCallForLeadResponse,
  GetAllCallsByLeadIdRequest,
  GetAllCallsByLeadIdResponse,
} from "@/types/services";

export const getAllCallsByLeadId = async (
  params: GetAllCallsByLeadIdRequest,
): Promise<GetAllCallsByLeadIdResponse> =>
  withApiHandler(async () => {
    const { leadId, ...queryParams } = params;
    const query = buildQueryParams(queryParams);
    const response = await api.get<ApiResponse<CallsData>>(
      `/call/${leadId}${query ? `?${query}` : ""}`,
    );

    const { message, data } = response.data;

    return {
      message,
      calls: data.calls,
      totalCount: data.totalCount,
    };
  });

export const createCallForLead = async (
  params: CreateCallForLeadRequest,
): Promise<CreateCallForLeadResponse> =>
  withApiHandler(async () => {
    const { leadId, ...body } = params;
    const response = await api.post<ApiResponse<CallData>>(
      `/call/${leadId}`,
      body,
    );

    const { message, data } = response.data;

    return {
      message,
      call: data.call,
    };
  });

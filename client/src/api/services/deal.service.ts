import { api } from "@/api";
import { withApiHandler } from "@/api/api-handler";
import { buildQueryParams } from "@/api/query-params";
import type { ApiResponse } from "@/api/api-response";
import type {
  DealData,
  DealsData,
  DeleteDealRequest,
  DeleteDealResponse,
  ExportDealsData,
  ExportDealsRequest,
  ExportDealsResponse,
  GetAllDealsRequest,
  GetAllDealsResponse,
  GetDealRequest,
  GetDealResponse,
  UpdateDealRequest,
  UpdateDealResponse,
} from "@/types/services";

export const getAllDeals = async (
  params: GetAllDealsRequest,
): Promise<GetAllDealsResponse> =>
  withApiHandler(async () => {
    const { cursor, limit = 10, search } = params;
    const query = buildQueryParams({ cursor, limit, search });
    const response = await api.get<ApiResponse<DealsData>>(
      `/deal${query ? `?${query}` : ""}`,
    );

    const { message, data } = response.data;

    return {
      message,
      deals: data.deals,
      totalCount: data.totalCount,
    };
  });

export const getDeal = async ({
  id,
}: GetDealRequest): Promise<GetDealResponse> =>
  withApiHandler(async () => {
    const response = await api.get<ApiResponse<DealData>>(`/deal/${id}`);

    const { message, data } = response.data;

    return { message, deal: data.deal };
  });

export const updateDeal = async ({
  id,
  ...data
}: UpdateDealRequest): Promise<UpdateDealResponse> =>
  withApiHandler(async () => {
    const response = await api.patch<ApiResponse<DealData>>(
      `/deal/${id}`,
      data,
    );

    const { message, data: updatedDealData } = response.data;

    return { message, deal: updatedDealData.deal };
  });

export const deleteDeal = async ({
  id,
}: DeleteDealRequest): Promise<DeleteDealResponse> =>
  withApiHandler(async () => {
    const response = await api.delete<ApiResponse<void>>(`/deal/${id}`);

    return { message: response.data.message };
  });

export const exportDeals = async (
  params: ExportDealsRequest,
): Promise<ExportDealsResponse> =>
  withApiHandler(async () => {
    const response = await api.post<ApiResponse<ExportDealsData>>(
      "/deal/export",
      params,
    );

    const { message, data } = response.data;

    return {
      message,
      messageId: data.messageId,
      dealCount: data.dealCount,
      recipientEmail: data.recipientEmail,
    };
  });

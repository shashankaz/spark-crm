import { api } from "@/api";
import { buildQueryParams } from "@/api/query-params";
import type { Call } from "@/types";

export type GetAllCallsByLeadIdResponse = {
  message: string;
  calls: Call[];
  totalCount: number;
};

export type CreateCallForLeadResponse = {
  message: string;
  call: Call;
};

export const getAllCallsByLeadId = async ({
  leadId,
  cursor,
  limit = 10,
  search,
}: {
  leadId: string;
  cursor?: string;
  limit?: number;
  search?: string;
}): Promise<GetAllCallsByLeadIdResponse> => {
  try {
    const query = buildQueryParams({ cursor, limit, search });
    const response = await api.get(`/call/${leadId}${query ? `?${query}` : ""}`);

    const { message } = response.data;
    const { calls, totalCount } = response.data.data;

    return { message, calls, totalCount };
  } catch (error) {
    console.error("Get all calls by lead ID error:", error);
    throw error;
  }
};

export const createCallForLead = async ({
  leadId,
  type,
  status,
  duration,
}: {
  leadId: string;
  type: string;
  status: string;
  duration: number;
}): Promise<CreateCallForLeadResponse> => {
  try {
    const response = await api.post(`/call/${leadId}`, {
      type,
      status,
      duration,
    });

    const { message } = response.data;
    const { call } = response.data.data;

    return { message, call };
  } catch (error) {
    console.error("Create call error:", error);
    throw error;
  }
};

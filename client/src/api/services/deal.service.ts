import { api } from "@/api";
import type { Deal } from "@/types";

export type GetAllDealsResponse = {
  message: string;
  deals: Deal[];
  totalCount: number;
};

export const getAllDeals = async ({
  cursor,
  limit = 10,
  search,
}: {
  cursor?: string;
  limit?: number;
  search?: string;
}): Promise<GetAllDealsResponse> => {
  try {
    const response = await api.get("/deal", {
      params: { cursor, limit, search },
    });

    const { message } = response.data;
    const { deals, totalCount } = response.data.data;

    return { message, deals, totalCount };
  } catch (error) {
    console.error("Get all deals error:", error);
    throw error;
  }
};

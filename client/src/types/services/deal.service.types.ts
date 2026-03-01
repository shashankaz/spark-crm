import type { Deal } from "@/types/domain";

export type DealsData = {
  deals: Deal[];
  totalCount: number;
};

export type DealData = {
  deal: Deal;
};

export type GetAllDealsRequest = {
  cursor?: string;
  limit?: number;
  search?: string;
};

export type GetDealRequest = { id: string };

export type UpdateDealRequest = {
  id: string;
  name?: string;
  value?: number;
  probability?: number;
};

export type DeleteDealRequest = { id: string };

export type GetAllDealsResponse = {
  message: string;
  deals: Deal[];
  totalCount: number;
};

export type GetDealResponse = { message: string; deal: Deal };

export type UpdateDealResponse = { message: string; deal: Deal };

export type DeleteDealResponse = { message: string };

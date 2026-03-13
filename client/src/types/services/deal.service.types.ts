import type { IDeal } from "@/types/domain";

export type DealsData = {
  deals: IDeal[];
  totalCount: number;
};

export type DealData = {
  deal: IDeal;
};

export type GetAllDealsRequest = {
  cursor?: string;
  limit?: number;
  search?: string;
  valueRange?: string;
  probability?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
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
  deals: IDeal[];
  totalCount: number;
};

export type GetDealResponse = { message: string; deal: IDeal };

export type UpdateDealResponse = { message: string; deal: IDeal };

export type DeleteDealResponse = { message: string };

export type ExportDealsRequest = {
  dealIds: string[];
  recipientEmail: string;
};

export type ExportDealsData = {
  messageId: string;
  dealCount: number;
  recipientEmail: string;
};

export type ExportDealsResponse = {
  message: string;
  messageId: string;
  dealCount: number;
  recipientEmail: string;
};

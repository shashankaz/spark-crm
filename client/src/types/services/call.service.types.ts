import type { ICall } from "@/types/domain";

/**
 * API response types
 */

export type CallsData = {
  calls: ICall[];
  totalCount: number;
};

export type CallData = {
  call: ICall;
};

/**
 * Request types
 */

export type GetAllCallsByLeadIdRequest = {
  leadId: string;
  cursor?: string;
  limit?: number;
  search?: string;
};

export type CreateCallForLeadRequest = {
  leadId: string;
  type: string;
  status: string;
  duration: number;
};

/**
 * Response types
 */

export type GetAllCallsByLeadIdResponse = {
  message: string;
  calls: ICall[];
  totalCount: number;
};

export type CreateCallForLeadResponse = {
  message: string;
  call: ICall;
};

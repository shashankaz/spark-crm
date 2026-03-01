import type { Call } from "@/types/domain";

export type CallsData = {
  calls: Call[];
  totalCount: number;
};

export type CallData = {
  call: Call;
};

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

export type GetAllCallsByLeadIdResponse = {
  message: string;
  calls: Call[];
  totalCount: number;
};

export type CreateCallForLeadResponse = {
  message: string;
  call: Call;
};

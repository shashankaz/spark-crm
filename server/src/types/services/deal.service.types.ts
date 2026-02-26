export interface FetchDealsInput {
  tenantId: string;
  cursor?: string;
  limit: number;
  search?: string;
}

export interface DealResponse {
  _id: any;
  name: string;
  value: number;
  probability: number;
  updatedAt: string;
}

export interface FetchDealsResponse {
  deals: DealResponse[];
  totalCount: number;
}

export interface DeleteDealInput {
  id: string;
  tenantId: string;
}

import { Types } from "mongoose";

export interface FetchDealsInput {
  tenantId: Types.ObjectId;
  cursor?: Types.ObjectId;
  limit: number;
  search?: string;
}

export interface DealResponse {
  _id: Types.ObjectId;
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
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
}

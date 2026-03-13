import { Types } from "mongoose";

export interface IFetchDealsInput {
  tenantId: Types.ObjectId;
  cursor?: Types.ObjectId;
  limit: number;
  search?: string;
  valueRange?: "low" | "medium" | "high";
  probability?: "low" | "medium" | "high";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IDealResponse {
  _id: Types.ObjectId;
  name: string;
  value: number;
  probability: number;
  updatedAt: string;
}

export interface IFetchDealsResponse {
  deals: IDealResponse[];
  totalCount: number;
}

export interface IDeleteDealInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
}

export interface IGetDealInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
}

export interface IUpdateDealInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  name?: string;
  value?: number;
  probability?: number;
}

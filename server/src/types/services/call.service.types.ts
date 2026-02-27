import { Types } from "mongoose";

export interface FetchCallsByLeadInput {
  leadId: Types.ObjectId;
  cursor?: Types.ObjectId;
  limit: number;
  search?: string;
}

export interface CreateCallForLeadInput {
  tenantId: Types.ObjectId;
  leadId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  type: string;
  from: string;
  status: string;
  duration?: number;
}

export interface CallResponse {
  _id: Types.ObjectId;
  leadId: Types.ObjectId;
  type: string;
  to: string;
  from: string;
  status: string;
  duration: number;
  createdAt: Date;
}

export interface FetchCallsByLeadResponse {
  calls: CallResponse[];
  totalCount: number;
}

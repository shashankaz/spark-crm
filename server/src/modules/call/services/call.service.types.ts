import { Types } from "mongoose";

export interface IFetchCallsByLeadInput {
  leadId: Types.ObjectId;
  cursor?: Types.ObjectId;
  limit: number;
  search?: string;
}

export interface ICreateCallForLeadInput {
  leadId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  type: string;
  from: string;
  status: string;
  duration?: number;
}

export interface ICallResponse {
  _id: Types.ObjectId;
  leadId: Types.ObjectId;
  type: string;
  to: string;
  from: string;
  status: string;
  duration: number;
  createdAt: Date;
}

export interface IFetchCallsByLeadResponse {
  calls: ICallResponse[];
  totalCount: number;
}

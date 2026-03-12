import { Types } from "mongoose";

export interface IFetchCommentsByLeadInput {
  leadId: Types.ObjectId;
  cursor?: Types.ObjectId;
  limit: number;
  search?: string;
}

export interface ICreateCommentForLeadInput {
  tenantId: Types.ObjectId;
  leadId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  comment: string;
}

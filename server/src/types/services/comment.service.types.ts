import { Types } from "mongoose";

export interface FetchCommentsByLeadInput {
  leadId: Types.ObjectId;
  cursor?: Types.ObjectId;
  limit: number;
  search?: string;
}

export interface CreateCommentForLeadInput {
  tenantId: Types.ObjectId;
  leadId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  comment: string;
}

import { Types } from "mongoose";

export interface CreateLeadActionHistoryInput {
  leadId: Types.ObjectId;
  actionType: string;
  message: string;
  userId: Types.ObjectId;
  userName: string;
}

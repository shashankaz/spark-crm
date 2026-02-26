import { Types, Document } from "mongoose";

export interface LeadActionHistoryBase {
  leadId: Types.ObjectId;
  actionType: string;
  message: string;
  userId: Types.ObjectId;
  userName: string;
  createdAt: Date;
}

export interface LeadActionHistoryDocument
  extends LeadActionHistoryBase, Document {
  _id: Types.ObjectId;
}

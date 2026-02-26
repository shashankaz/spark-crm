import { Types, Document } from "mongoose";

export type CallType = "inbound" | "outbound";

export type CallStatus = "completed" | "missed" | "cancelled";

export interface CallBase {
  leadId: Types.ObjectId;
  type: CallType;
  to: string;
  from: string;
  status: CallStatus;
  duration: number;
  createdAt: Date;
}

export interface CallDocument extends CallBase, Document {
  _id: Types.ObjectId;
}

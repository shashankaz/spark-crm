import { Types, Document } from "mongoose";

export type CallType = "inbound" | "outbound";

export type CallStatus = "completed" | "missed" | "cancelled";

export interface ICallBase {
  leadId: Types.ObjectId;
  type: CallType;
  to: string;
  from: string;
  status: CallStatus;
  duration: number;
  createdAt: Date;
}

export interface ICallDocument extends ICallBase, Document {
  _id: Types.ObjectId;
}

import { Types, Document } from "mongoose";

export interface DealBase {
  idempotentId: Types.UUID;
  tenantId: Types.ObjectId;
  leadId?: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  value: number;
  probability: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DealDocument extends DealBase, Document {
  _id: Types.ObjectId;
}

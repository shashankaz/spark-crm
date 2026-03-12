import { Types, Document } from "mongoose";

export interface IDealBase {
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

export interface IDealDocument extends IDealBase, Document {
  _id: Types.ObjectId;
}

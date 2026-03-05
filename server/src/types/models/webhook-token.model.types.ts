import { Types, Document } from "mongoose";

export interface WebhookTokenBase {
  tenantId: Types.ObjectId;
  name: string;
  tokenHash: string;
  isActive: boolean;
  createdBy: Types.ObjectId;
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookTokenDocument extends WebhookTokenBase, Document {
  _id: Types.ObjectId;
}

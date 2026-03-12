import { Types, Document } from "mongoose";

export interface IWebhookTokenBase {
  tenantId: Types.ObjectId;
  name: string;
  tokenHash: string;
  isActive: boolean;
  createdBy: Types.ObjectId;
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWebhookTokenDocument extends IWebhookTokenBase, Document {
  _id: Types.ObjectId;
}

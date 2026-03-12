import { Types } from "mongoose";

export interface IGenerateWebhookTokenInput {
  tenantId: Types.ObjectId;
  name: string;
  createdBy: Types.ObjectId;
}

export interface IRevokeWebhookTokenInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
}

export interface ICreateWebhookLeadInput {
  tenantId: Types.ObjectId;
  firstName: string;
  lastName?: string;
  email: string;
  mobile: string;
  gender: string;
  source?: string;
}

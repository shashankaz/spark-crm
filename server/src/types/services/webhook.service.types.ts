import { Types } from "mongoose";

export interface GenerateWebhookTokenInput {
  tenantId: Types.ObjectId;
  name: string;
  createdBy: Types.ObjectId;
}

export interface RevokeWebhookTokenInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
}

export interface CreateWebhookLeadInput {
  tenantId: Types.ObjectId;
  firstName: string;
  lastName?: string;
  email: string;
  mobile: string;
  gender: string;
  source?: string;
}

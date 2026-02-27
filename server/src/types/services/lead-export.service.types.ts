import { Types } from "mongoose";

export interface LeadExportJobPayload {
  tenantId: Types.ObjectId;
  leadIds: Types.ObjectId[];
  recipientEmail: string;
}

export interface EnqueueLeadExportInput {
  tenantId: Types.ObjectId;
  leadIds: Types.ObjectId[];
  recipientEmail: string;
}

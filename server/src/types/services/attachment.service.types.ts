import { Types } from "mongoose";

export interface FetchAttachmentsByLeadInput {
  leadId: string;
  cursor?: string;
  limit?: number;
  search?: string;
}

export interface CreateAttachmentForLeadInput {
  tenantId: string;
  leadId: string;
  userId: Types.ObjectId;
  userName: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
}

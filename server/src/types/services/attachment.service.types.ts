import { Types } from "mongoose";

export interface FetchAttachmentsByLeadInput {
  leadId: Types.ObjectId;
  cursor?: Types.ObjectId;
  limit?: number;
  search?: string;
}

export interface CreateAttachmentForLeadInput {
  tenantId: Types.ObjectId;
  leadId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
}

import { Types } from "mongoose";

export interface IFetchAttachmentsByLeadInput {
  leadId: Types.ObjectId;
  cursor?: Types.ObjectId;
  limit?: number;
  search?: string;
}

export interface ICreateAttachmentForLeadInput {
  leadId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
}

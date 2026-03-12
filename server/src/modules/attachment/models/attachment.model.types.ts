import { Document, Types } from "mongoose";

export interface IAttachmentDocument extends Document {
  leadId: Types.ObjectId;
  fileName: string;
  fileUrl: string;
  fileType: string;
  createdAt: Date;
  updatedAt: Date;
}

import { Types } from "mongoose";

export interface GenerateUploadUrlInput {
  type: string;
  fileName: string;
  fileType: string;
  userId: Types.ObjectId;
}

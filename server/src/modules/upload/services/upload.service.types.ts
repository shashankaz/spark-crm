import { Types } from "mongoose";

export interface IGenerateUploadUrlInput {
  type: string;
  fileName: string;
  fileType: string;
  userId: Types.ObjectId;
}

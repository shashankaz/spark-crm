import { Types } from "mongoose";

export interface IImportLeadsInput {
  filePath: string;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
}

export interface IImportLeadsResult {
  inserted: number;
  failed: number;
  failedLeadIds: string[];
}

import { Types } from "mongoose";

export interface ImportLeadsInput {
  filePath: string;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
}

export interface ImportLeadsResult {
  inserted: number;
  failed: number;
  failedLeadIds: string[];
}

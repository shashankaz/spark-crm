import { Types, Document } from "mongoose";

export type LeadGender = "male" | "female" | "other";
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "lost";

export interface LeadBase {
  idempotentId: Types.UUID;
  tenantId: Types.ObjectId;
  orgId?: Types.ObjectId;
  orgName?: string;
  dealId?: Types.ObjectId;
  userId: Types.ObjectId;
  firstName: string;
  lastName?: string;
  email: string;
  mobile: string;
  gender: LeadGender;
  source?: string;
  score: number;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadDocument extends LeadBase, Document {
  _id: Types.ObjectId;
}

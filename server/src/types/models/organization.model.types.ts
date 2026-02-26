import { Types, Document } from "mongoose";

export type OrganizationIndustry =
  | "technology"
  | "finance"
  | "healthcare"
  | "education"
  | "retail"
  | "manufacturing"
  | "real estate"
  | "other";
export type OrganizationSize = "smb" | "mid-market" | "enterprise";

export interface OrganizationBase {
  idempotentId: Types.UUID;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  industry?: OrganizationIndustry;
  size?: OrganizationSize;
  country?: string;
  email?: string;
  mobile?: string;
  website?: string;
  contactName?: string;
  contactEmail?: string;
  contactMobile?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationDocument extends OrganizationBase, Document {
  _id: Types.ObjectId;
}

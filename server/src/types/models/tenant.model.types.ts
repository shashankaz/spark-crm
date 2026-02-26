import { Types, Document } from "mongoose";

export type TenantPlan = "free" | "basic" | "pro" | "enterprise";

export interface TenantAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface TenantBase {
  name: string;
  gstNumber?: string;
  panNumber?: string;
  email: string;
  mobile: string;
  address?: TenantAddress;
  logoUrl?: string;
  plan: TenantPlan;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantDocument extends TenantBase, Document {
  _id: Types.ObjectId;
}

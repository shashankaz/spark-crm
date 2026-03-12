import { Types, Document } from "mongoose";

export type TenantPlan = "free" | "basic" | "pro" | "enterprise";

export interface ITenantAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface ITenantBase {
  name: string;
  gstNumber?: string;
  panNumber?: string;
  email: string;
  slug: string;
  mobile: string;
  address?: ITenantAddress;
  logoUrl?: string;
  plan: TenantPlan;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITenantDocument extends ITenantBase, Document {
  _id: Types.ObjectId;
}

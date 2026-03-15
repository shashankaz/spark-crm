import { Types } from "mongoose";

export interface IFetchTenantsInput {
  cursor?: Types.ObjectId;
  limit: number;
  search?: string;
  plan?: string;
  country?: string;
}

export interface IFetchTenantByIdInput {
  id: Types.ObjectId;
}

export interface IFetchUsersByTenantIdInput {
  tenantId: Types.ObjectId;
  search?: string;
}

export interface ICheckSlugAvailabilityInput {
  slug: string;
}

export interface ICreateTenantInput {
  name: string;
  slug: string;
  gstNumber?: string;
  panNumber?: string;
  email: string;
  mobile: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  plan: string;
}

export interface IUpdateTenantByIdInput extends Partial<ICreateTenantInput> {
  id: Types.ObjectId;
}

export interface IDeleteTenantByIdInput {
  id: Types.ObjectId;
}

export interface ICreateUserForTenantInput {
  tenantId: Types.ObjectId;
  name: string;
  email: string;
  mobile?: string;
  password?: string;
  role?: string;
}

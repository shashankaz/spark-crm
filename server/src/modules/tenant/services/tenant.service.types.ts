import { Types } from "mongoose";

export interface FetchTenantsInput {
  cursor?: Types.ObjectId;
  limit: number;
  search?: string;
}

export interface FetchTenantByIdInput {
  id: Types.ObjectId;
}

export interface FetchUsersByTenantIdInput {
  tenantId: Types.ObjectId;
  search?: string;
}

export interface CheckSlugAvailabilityInput {
  slug: string;
}

export interface CreateTenantInput {
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

export interface UpdateTenantByIdInput extends Partial<CreateTenantInput> {
  id: Types.ObjectId;
}

export interface DeleteTenantByIdInput {
  id: Types.ObjectId;
}

export interface CreateUserForTenantInput {
  tenantId: Types.ObjectId;
  name: string;
  email: string;
  mobile?: string;
  password?: string;
  role?: string;
}

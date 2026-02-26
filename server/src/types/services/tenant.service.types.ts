export interface FetchTenantsInput {
  cursor?: string;
  limit: number;
  search?: string;
}

export interface FetchTenantByIdInput {
  id: string;
}

export interface FetchUsersByTenantIdInput {
  tenantId: string;
  search?: string;
}

export interface CreateTenantInput {
  name: string;
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

export interface UpdateTenantByIdInput {
  id: string;
  name?: string;
  gstNumber?: string;
  panNumber?: string;
  email?: string;
  mobile?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  plan?: string;
}

export interface DeleteTenantByIdInput {
  id: string;
}

export interface CreateUserForTenantInput {
  tenantId: string;
  name: string;
  email: string;
  mobile?: string;
  password?: string;
  role?: string;
}

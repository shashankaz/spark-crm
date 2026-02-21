import { api } from "@/api";
import type { Tenant, User } from "@/types";

export type GetTenantDashboardStatsResponse = {
  message: string;
};

export type GetAllTenantsResponse = {
  message: string;
  tenants: Tenant[];
  totalCount: number;
};

export type GetTenantByIdResponse = {
  message: string;
  tenant: Tenant;
  usersCount: number;
  users: User[];
};

export type CreateTenantResponse = {
  message: string;
  tenant: Tenant;
};

export type UpdateTenantResponse = {
  message: string;
  tenant: Tenant;
};

export type DeleteTenantResponse = {
  message: string;
  id: string;
};

export type CreateUserForTenantResponse = {
  message: string;
  user: User;
};

export const getTenantDashboardStats =
  async (): Promise<GetTenantDashboardStatsResponse> => {
    try {
      const response = await api.get("/tenant/dashboard");

      const { message } = response.data;

      return { message };
    } catch (error) {
      console.error("Get tenant dashboard stats error:", error);
      throw error;
    }
  };

export const getAllTenants = async ({
  cursor,
  limit = 10,
  search,
}: {
  cursor?: string;
  limit?: number;
  search?: string;
}): Promise<GetAllTenantsResponse> => {
  try {
    const response = await api.get("/tenant", {
      params: { cursor, limit, search },
    });

    const { message } = response.data;
    const { tenants, totalCount } = response.data.data;

    return { message, tenants, totalCount };
  } catch (error) {
    console.error("Get all tenants error:", error);
    throw error;
  }
};

export const getTenantById = async ({
  id,
}: {
  id: string;
}): Promise<GetTenantByIdResponse> => {
  try {
    const response = await api.get(`/tenant/${id}`);

    const { message } = response.data;
    const { tenant, usersCount, users } = response.data.data;

    return { message, tenant, usersCount, users };
  } catch (error) {
    console.error("Get tenant by ID error:", error);
    throw error;
  }
};

export const createTenant = async ({
  name,
  gstNumber,
  panNumber,
  email,
  mobile,
  address,
  plan,
}: {
  name: string;
  gstNumber?: string;
  panNumber?: string;
  email: string;
  mobile: string;
  address?: string;
  plan?: string;
}): Promise<CreateTenantResponse> => {
  try {
    const response = await api.post("/tenant", {
      name,
      gstNumber,
      panNumber,
      email,
      mobile,
      address,
      plan,
    });

    const { message } = response.data;
    const { tenant } = response.data.data;

    return { message, tenant };
  } catch (error) {
    console.error("Create tenant error:", error);
    throw error;
  }
};

export const updateTenantById = async ({
  id,
  name,
  gstNumber,
  panNumber,
  email,
  mobile,
  address,
  plan,
}: {
  id: string;
  name?: string;
  gstNumber?: string;
  panNumber?: string;
  email?: string;
  mobile?: string;
  address?: string;
  plan?: string;
}): Promise<UpdateTenantResponse> => {
  try {
    const response = await api.patch(`/tenant/${id}`, {
      name,
      gstNumber,
      panNumber,
      email,
      mobile,
      address,
      plan,
    });

    const { message } = response.data;
    const { updatedTenant } = response.data.data;

    return { message, tenant: updatedTenant };
  } catch (error) {
    console.error("Update tenant error:", error);
    throw error;
  }
};

export const deleteTenantById = async ({
  id,
}: {
  id: string;
}): Promise<DeleteTenantResponse> => {
  try {
    const response = await api.delete(`/tenant/${id}`);

    const { message } = response.data;
    const { id: deletedId } = response.data.data;

    return { message, id: deletedId };
  } catch (error) {
    console.error("Delete tenant error:", error);
    throw error;
  }
};

export const createUserForTenant = async ({
  tenantId,
  name,
  email,
  mobile,
  password,
  role,
}: {
  tenantId: string;
  name: string;
  email: string;
  mobile?: string;
  password: string;
  role: string;
}): Promise<CreateUserForTenantResponse> => {
  try {
    const response = await api.post(`/tenant/${tenantId}/user`, {
      name,
      email,
      mobile,
      password,
      role,
    });

    const { message } = response.data;
    const { user } = response.data.data;

    return { message, user };
  } catch (error) {
    console.error("Create user for tenant error:", error);
    throw error;
  }
};

import { api } from "@/api";
import { withApiHandler } from "@/api/api-handler";
import { buildQueryParams } from "@/api/query-params";
import type { ApiResponse } from "@/api/api-response";
import type {
  CreatedTenantData,
  CreateTenantRequest,
  CreateTenantResponse,
  CreateUserForTenantRequest,
  CreateUserForTenantResponse,
  DeletedTenantData,
  DeleteTenantByIdRequest,
  DeleteTenantResponse,
  GetAllTenantsRequest,
  GetAllTenantsResponse,
  GetTenantByIdRequest,
  GetTenantByIdResponse,
  GetTenantDashboardStatsResponse,
  GetUsersByTenantIdRequest,
  GetUsersByTenantIdResponse,
  TenantData,
  TenantsData,
  UpdatedTenantData,
  UpdateTenantByIdRequest,
  UpdateTenantResponse,
  TenantDashboardStatsData,
  TenantUserData,
  TenantUsersData,
} from "@/types/services";

export const getTenantDashboardStats =
  async (): Promise<GetTenantDashboardStatsResponse> =>
    withApiHandler(async () => {
      const response =
        await api.get<ApiResponse<TenantDashboardStatsData>>(
          "/tenant/dashboard",
        );

      const { message, data } = response.data;

      return {
        message,
        stats: data.stats,
        recentTenants: data.recentTenants,
        planDistribution: data.planDistribution,
      };
    });

export const getAllTenants = async (
  params: GetAllTenantsRequest,
): Promise<GetAllTenantsResponse> =>
  withApiHandler(async () => {
    const { cursor, limit = 10, search } = params;
    const query = buildQueryParams({ cursor, limit, search });
    const response = await api.get<ApiResponse<TenantsData>>(
      `/tenant${query ? `?${query}` : ""}`,
    );

    const { message, data } = response.data;

    return {
      message,
      tenants: data.tenants,
      totalCount: data.totalCount,
    };
  });

export const getTenantById = async (
  params: GetTenantByIdRequest,
): Promise<GetTenantByIdResponse> =>
  withApiHandler(async () => {
    const { id } = params;
    const response = await api.get<ApiResponse<TenantData>>(`/tenant/${id}`);

    const { message, data } = response.data;

    return {
      message,
      tenant: data.tenant,
      usersCount: data.usersCount || 0,
    };
  });

export const createTenant = async (
  params: CreateTenantRequest,
): Promise<CreateTenantResponse> =>
  withApiHandler(async () => {
    const response = await api.post<ApiResponse<CreatedTenantData>>(
      "/tenant",
      params,
    );

    const { message, data } = response.data;

    return {
      message,
      tenant: data.tenant,
    };
  });

export const updateTenantById = async (
  params: UpdateTenantByIdRequest,
): Promise<UpdateTenantResponse> =>
  withApiHandler(async () => {
    const { id, ...body } = params;
    const response = await api.patch<ApiResponse<UpdatedTenantData>>(
      `/tenant/${id}`,
      body,
    );

    const { message, data } = response.data;

    return {
      message,
      tenant: data.updatedTenant,
    };
  });

export const deleteTenantById = async (
  params: DeleteTenantByIdRequest,
): Promise<DeleteTenantResponse> =>
  withApiHandler(async () => {
    const { id } = params;
    const response = await api.delete<ApiResponse<DeletedTenantData>>(
      `/tenant/${id}`,
    );

    const { message, data } = response.data;

    return {
      message,
      id: data.id,
    };
  });

export const getUsersByTenantId = async (
  params: GetUsersByTenantIdRequest,
): Promise<GetUsersByTenantIdResponse> =>
  withApiHandler(async () => {
    const { id, search } = params;
    const query = buildQueryParams({ search });
    const response = await api.get<ApiResponse<TenantUsersData>>(
      `/tenant/${id}/users${query ? `?${query}` : ""}`,
    );

    const { message, data } = response.data;

    return {
      message,
      users: data.users,
    };
  });

export const createUserForTenant = async (
  params: CreateUserForTenantRequest,
): Promise<CreateUserForTenantResponse> =>
  withApiHandler(async () => {
    const { tenantId, ...body } = params;
    const response = await api.post<ApiResponse<TenantUserData>>(
      `/tenant/${tenantId}/user`,
      body,
    );

    const { message, data } = response.data;

    return {
      message,
      user: data.user,
    };
  });

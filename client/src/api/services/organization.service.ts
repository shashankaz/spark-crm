import { api } from "@/api";
import { withApiHandler } from "@/api/api-handler";
import { buildQueryParams } from "@/api/query-params";
import type { ApiResponse } from "@/api/api-response";
import type {
  CreateOrganizationRequest,
  CreateOrganizationResponse,
  DeletedOrganizationData,
  DeleteOrganizationByIdRequest,
  DeleteOrganizationResponse,
  ExportOrganizationsData,
  ExportOrganizationsRequest,
  ExportOrganizationsResponse,
  GetAllOrganizationsRequest,
  GetAllOrganizationsResponse,
  GetOrganizationByIdRequest,
  GetOrganizationByIdResponse,
  OrganizationData,
  OrganizationsData,
  UpdatedOrganizationData,
  UpdateOrganizationByIdRequest,
  UpdateOrganizationResponse,
} from "@/types/services";

export const getAllOrganizations = async (
  params: GetAllOrganizationsRequest,
): Promise<GetAllOrganizationsResponse> =>
  withApiHandler(async () => {
    const { cursor, limit = 10, search } = params;
    const query = buildQueryParams({ cursor, limit, search });
    const response = await api.get<ApiResponse<OrganizationsData>>(
      `/organization${query ? `?${query}` : ""}`,
    );

    const { message, data } = response.data;

    return {
      message,
      organizations: data.organizations,
      totalCount: data.totalCount,
    };
  });

export const getOrganizationById = async (
  params: GetOrganizationByIdRequest,
): Promise<GetOrganizationByIdResponse> =>
  withApiHandler(async () => {
    const { id } = params;
    const response = await api.get<ApiResponse<OrganizationData>>(
      `/organization/${id}`,
    );

    const { message, data } = response.data;

    return {
      message,
      organization: data.organization,
    };
  });

export const createOrganization = async (
  params: CreateOrganizationRequest,
): Promise<CreateOrganizationResponse> =>
  withApiHandler(async () => {
    const response = await api.post<ApiResponse<OrganizationData>>(
      "/organization",
      params,
    );

    const { message, data } = response.data;

    return {
      message,
      organization: data.organization,
    };
  });

export const updateOrganizationById = async (
  params: UpdateOrganizationByIdRequest,
): Promise<UpdateOrganizationResponse> =>
  withApiHandler(async () => {
    const { id, ...body } = params;
    const response = await api.patch<ApiResponse<UpdatedOrganizationData>>(
      `/organization/${id}`,
      body,
    );

    const { message, data } = response.data;

    return {
      message,
      updatedOrganization: data.updatedOrganization,
    };
  });

export const deleteOrganizationById = async (
  params: DeleteOrganizationByIdRequest,
): Promise<DeleteOrganizationResponse> =>
  withApiHandler(async () => {
    const { id } = params;
    const response = await api.delete<ApiResponse<DeletedOrganizationData>>(
      `/organization/${id}`,
    );

    const { message, data } = response.data;

    return {
      message,
      id: data.id,
    };
  });

export const exportOrganizations = async (
  params: ExportOrganizationsRequest,
): Promise<ExportOrganizationsResponse> =>
  withApiHandler(async () => {
    const response = await api.post<ApiResponse<ExportOrganizationsData>>(
      "/organization/export",
      params,
    );

    const { message, data } = response.data;

    return {
      message,
      messageId: data.messageId,
      organizationCount: data.organizationCount,
      recipientEmail: data.recipientEmail,
    };
  });

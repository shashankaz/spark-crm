import { api } from "@/api";
import { withApiHandler } from "@/api/api-handler";
import { buildQueryParams } from "@/api/query-params";
import type { ApiResponse } from "@/api/api-response";
import type {
  ActivitiesData,
  AssignLeadRequest,
  AssignLeadResponse,
  ConvertLeadToDealRequest,
  ConvertLeadToDealResponse,
  CreateLeadRequest,
  CreateLeadResponse,
  DealData,
  DeletedLeadData,
  DeleteLeadByIdRequest,
  DeleteLeadResponse,
  GetAllLeadsRequest,
  GetAllLeadsResponse,
  GetLeadActivityByLeadIdRequest,
  GetLeadActivityByLeadIdResponse,
  GetLeadByIdRequest,
  GetLeadByIdResponse,
  GetLeadOrganizationsRequest,
  GetLeadOrganizationsResponse,
  LeadData,
  LeadsData,
  OrganizationsData,
  UpdatedLeadData,
  UpdateLeadByIdRequest,
  UpdateLeadResponse,
} from "@/types/services";

export const getAllLeads = async (
  params: GetAllLeadsRequest,
): Promise<GetAllLeadsResponse> =>
  withApiHandler(async () => {
    const { cursor, limit = 10, search, orgId } = params;
    const query = buildQueryParams({ cursor, limit, search, orgId });
    const response = await api.get<ApiResponse<LeadsData>>(
      `/lead${query ? `?${query}` : ""}`,
    );

    const { message, data } = response.data;

    return {
      message,
      leads: data.leads,
      totalCount: data.totalCount,
    };
  });

export const getLeadById = async (
  params: GetLeadByIdRequest,
): Promise<GetLeadByIdResponse> =>
  withApiHandler(async () => {
    const { id } = params;
    const response = await api.get<ApiResponse<LeadData>>(`/lead/${id}`);

    const { message, data } = response.data;

    return {
      message,
      lead: data.lead,
    };
  });

export const createLead = async (
  params: CreateLeadRequest,
): Promise<CreateLeadResponse> =>
  withApiHandler(async () => {
    const response = await api.post<ApiResponse<LeadData>>("/lead", params);

    const { message, data } = response.data;

    return {
      message,
      lead: data.lead,
    };
  });

export const updateLeadById = async (
  params: UpdateLeadByIdRequest,
): Promise<UpdateLeadResponse> =>
  withApiHandler(async () => {
    const { id, ...body } = params;
    const response = await api.patch<ApiResponse<UpdatedLeadData>>(
      `/lead/${id}`,
      body,
    );

    const { message, data } = response.data;

    return {
      message,
      lead: data.updatedLead,
    };
  });

export const deleteLeadById = async (
  params: DeleteLeadByIdRequest,
): Promise<DeleteLeadResponse> =>
  withApiHandler(async () => {
    const { id } = params;
    const response = await api.delete<ApiResponse<DeletedLeadData>>(
      `/lead/${id}`,
    );

    const { message, data } = response.data;

    return {
      message,
      id: data.id,
    };
  });

export const getLeadActivityByLeadId = async (
  params: GetLeadActivityByLeadIdRequest,
): Promise<GetLeadActivityByLeadIdResponse> =>
  withApiHandler(async () => {
    const { id } = params;
    const response = await api.get<ApiResponse<ActivitiesData>>(
      `/lead/activity/${id}`,
    );

    const { message, data } = response.data;

    return {
      message,
      activities: data.activities,
    };
  });

export const convertLeadToDeal = async (
  params: ConvertLeadToDealRequest,
): Promise<ConvertLeadToDealResponse> =>
  withApiHandler(async () => {
    const { id, ...body } = params;
    const response = await api.post<ApiResponse<DealData>>(
      `/lead/${id}/convert`,
      body,
    );

    const { message, data } = response.data;

    return {
      message,
      deal: data.deal,
    };
  });

export const getLeadOrganizations = async (
  params: GetLeadOrganizationsRequest,
): Promise<GetLeadOrganizationsResponse> =>
  withApiHandler(async () => {
    const { limit = 10, search } = params;
    const query = buildQueryParams({ limit, search });
    const response = await api.get<ApiResponse<OrganizationsData>>(
      `/lead/organizations${query ? `?${query}` : ""}`,
    );

    const { message, data } = response.data;

    return {
      message,
      organizations: data.organizations,
    };
  });

export const assignLead = async (
  params: AssignLeadRequest,
): Promise<AssignLeadResponse> =>
  withApiHandler(async () => {
    const { id, assignedUserId } = params;
    const response = await api.patch<ApiResponse<LeadData>>(
      `/lead/${id}/assign`,
      {
        assignedUserId,
      },
    );

    const { message, data } = response.data;

    return {
      message,
      lead: data.lead,
    };
  });

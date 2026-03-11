import { api } from "@/api";
import { withApiHandler } from "@/api/api-handler";
import type { ApiResponse } from "@/api/api-response";
import type {
  CampaignResponse,
  CampaignResult,
  CreateGroupRequest,
  DeleteGroupRequest,
  DeleteGroupResponse,
  GetGroupRequest,
  GetGroupResponse,
  GetGroupsResponse,
  GroupData,
  GroupsData,
  SendCampaignRequest,
  UpdateGroupRequest,
} from "@/types/services";

export const getGroups = async (): Promise<GetGroupsResponse> =>
  withApiHandler(async () => {
    const response = await api.get<ApiResponse<GroupsData>>("/group");

    const { message, data } = response.data;

    return {
      message,
      groups: data.groups,
      totalCount: data.totalCount,
    };
  });

export const getGroup = async ({
  id,
}: GetGroupRequest): Promise<GetGroupResponse> =>
  withApiHandler(async () => {
    const response = await api.get<ApiResponse<GroupData>>(`/group/${id}`);

    const { message, data } = response.data;

    return {
      message,
      group: data.group,
    };
  });

export const createGroup = async (
  params: CreateGroupRequest,
): Promise<GetGroupResponse> =>
  withApiHandler(async () => {
    const response = await api.post<ApiResponse<GroupData>>("/group", params);

    const { message, data } = response.data;

    return {
      message,
      group: data.group,
    };
  });

export const updateGroup = async (
  params: UpdateGroupRequest,
): Promise<GetGroupResponse> =>
  withApiHandler(async () => {
    const { id, ...rest } = params;
    const response = await api.put<ApiResponse<GroupData>>(
      `/group/${id}`,
      rest,
    );

    const { message, data } = response.data;

    return {
      message,
      group: data.group,
    };
  });

export const deleteGroup = async (
  params: DeleteGroupRequest,
): Promise<DeleteGroupResponse> =>
  withApiHandler(async () => {
    const { id } = params;
    const response = await api.delete<ApiResponse<void>>(`/group/${id}`);

    const { message } = response.data;

    return { message };
  });

export const sendCampaignToGroup = async (
  params: SendCampaignRequest,
): Promise<CampaignResponse> =>
  withApiHandler(async () => {
    const { groupId, ...rest } = params;
    const response = await api.post<ApiResponse<CampaignResult>>(
      `/group/${groupId}/campaign`,
      rest,
    );

    const { message, data } = response.data;

    return {
      message,
      total: data.total,
      successful: data.successful,
      failed: data.failed,
    };
  });

import { api } from "@/api";
import { withApiHandler } from "@/api/api-handler";
import type { ApiResponse } from "@/api/api-response";
import { buildQueryParams } from "@/api/query-params";
import type {
  CreateWorkflowPayload,
  CreateWorkflowResponse,
  DeletedWorkflowData,
  DeleteWorkflowRequest,
  DeleteWorkflowResponse,
  GetAllWorkflowsRequest,
  GetAllWorkflowsResponse,
  GetWorkflowByIdRequest,
  GetWorkflowByIdResponse,
  ToggleWorkflowRequest,
  ToggleWorkflowResponse,
  UpdateWorkflowPayload,
  UpdateWorkflowResponse,
  WorkflowData,
  WorkflowsData,
} from "@/types/services";

export const getAllWorkflows = async (
  params: GetAllWorkflowsRequest,
): Promise<GetAllWorkflowsResponse> =>
  withApiHandler(async () => {
    const { cursor, limit = 20, search } = params;
    const query = buildQueryParams({ cursor, limit, search });
    const response = await api.get<ApiResponse<WorkflowsData>>(
      `/workflow${query ? `?${query}` : ""}`,
    );

    const { message, data } = response.data;

    return {
      message,
      workflows: data.workflows,
      totalCount: data.totalCount,
    };
  });

export const getWorkflowById = async (
  params: GetWorkflowByIdRequest,
): Promise<GetWorkflowByIdResponse> =>
  withApiHandler(async () => {
    const { id } = params;
    const response = await api.get<ApiResponse<WorkflowData>>(
      `/workflow/${id}`,
    );

    const { message, data } = response.data;

    return {
      message,
      workflow: data.workflow,
    };
  });

export const createWorkflow = async (
  payload: CreateWorkflowPayload,
): Promise<CreateWorkflowResponse> =>
  withApiHandler(async () => {
    const response = await api.post<ApiResponse<WorkflowData>>(
      "/workflow",
      payload,
    );

    const { message, data } = response.data;

    return {
      message,
      workflow: data.workflow,
    };
  });

export const updateWorkflow = async (
  payload: UpdateWorkflowPayload,
): Promise<UpdateWorkflowResponse> =>
  withApiHandler(async () => {
    const { id, ...body } = payload;
    const response = await api.patch<ApiResponse<WorkflowData>>(
      `/workflow/${id}`,
      body,
    );

    const { message, data } = response.data;

    return {
      message,
      workflow: data.workflow,
    };
  });

export const deleteWorkflow = async (
  params: DeleteWorkflowRequest,
): Promise<DeleteWorkflowResponse> =>
  withApiHandler(async () => {
    const { id } = params;
    const response = await api.delete<ApiResponse<DeletedWorkflowData>>(
      `/workflow/${id}`,
    );

    const { message, data } = response.data;

    return {
      message,
      id: data.id,
    };
  });

export const toggleWorkflow = async (
  params: ToggleWorkflowRequest,
): Promise<ToggleWorkflowResponse> =>
  withApiHandler(async () => {
    const { id } = params;
    const response = await api.patch<ApiResponse<WorkflowData>>(
      `/workflow/${id}/toggle`,
    );

    const { message, data } = response.data;

    return {
      message,
      workflow: data.workflow,
    };
  });

import { api } from "@/api";
import { withApiHandler } from "@/api/api-handler";
import { buildQueryParams } from "@/api/query-params";
import type { ApiResponse } from "@/api/api-response";
import type {
  CreateTaskRequest,
  CreateTaskResponse,
  DeleteTaskRequest,
  DeleteTaskResponse,
  GetAllTasksRequest,
  GetAllTasksResponse,
  GetTaskRequest,
  GetTaskResponse,
  TaskData,
  TasksData,
  UpdateTaskRequest,
  UpdateTaskResponse,
} from "@/types/services";

export const getAllTasks = async (
  params: GetAllTasksRequest,
): Promise<GetAllTasksResponse> =>
  withApiHandler(async () => {
    const query = buildQueryParams(params);
    const response = await api.get<ApiResponse<TasksData>>(
      `/task${query ? `?${query}` : ""}`,
    );

    const { message, data } = response.data;

    return { message, tasks: data.tasks, counts: data.counts };
  });

export const getTask = async ({
  id,
}: GetTaskRequest): Promise<GetTaskResponse> =>
  withApiHandler(async () => {
    const response = await api.get<ApiResponse<TaskData>>(`/task/${id}`);

    const { message, data } = response.data;

    return { message, task: data.task };
  });

export const createTask = async (
  payload: CreateTaskRequest,
): Promise<CreateTaskResponse> =>
  withApiHandler(async () => {
    const response = await api.post<ApiResponse<TaskData>>("/task", payload);

    const { message, data } = response.data;

    return { message, task: data.task };
  });

export const updateTask = async ({
  id,
  ...data
}: UpdateTaskRequest): Promise<UpdateTaskResponse> =>
  withApiHandler(async () => {
    const response = await api.patch<ApiResponse<TaskData>>(
      `/task/${id}`,
      data,
    );

    const { message, data: updatedData } = response.data;

    return { message, task: updatedData.task };
  });

export const deleteTask = async ({
  id,
}: DeleteTaskRequest): Promise<DeleteTaskResponse> =>
  withApiHandler(async () => {
    const response = await api.delete<ApiResponse<void>>(`/task/${id}`);

    return { message: response.data.message };
  });

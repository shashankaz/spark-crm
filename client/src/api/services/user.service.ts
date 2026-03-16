import { api } from "@/api";
import { withApiHandler } from "@/api/api-handler";
import { buildQueryParams } from "@/api/query-params";
import type { ApiResponse } from "@/api/api-response";
import type {
  CreatedUserData,
  CreateUserRequest,
  CreateUserResponse,
  DeletedUserData,
  DeleteUserRequest,
  DeleteUserResponse,
  ExportUsersData,
  ExportUsersRequest,
  ExportUsersResponse,
  GeneratePasswordRequest,
  GeneratePasswordResponse,
  GetAllUsersRequest,
  GetAllUsersResponse,
  GetUserByIdRequest,
  GetUserByIdResponse,
  UpdatedUserData,
  UpdateUserRequest,
  UpdateUserResponse,
  UserData,
  UsersData,
} from "@/types/services";

export const getAllUsers = async (
  params: GetAllUsersRequest,
): Promise<GetAllUsersResponse> =>
  withApiHandler(async () => {
    const { cursor, limit = 10, search, role } = params;
    const query = buildQueryParams({ cursor, limit, search, role });
    const response = await api.get<ApiResponse<UsersData>>(
      `/user${query ? `?${query}` : ""}`,
    );

    const { message, data } = response.data;

    return {
      message,
      users: data.users,
      totalCount: data.totalCount,
    };
  });

export const getUserById = async (
  params: GetUserByIdRequest,
): Promise<GetUserByIdResponse> =>
  withApiHandler(async () => {
    const { id } = params;
    const response = await api.get<ApiResponse<UserData>>(`/user/${id}`);

    const { message, data } = response.data;

    return {
      message,
      user: data.user,
    };
  });

export const createUser = async (
  params: CreateUserRequest,
): Promise<CreateUserResponse> =>
  withApiHandler(async () => {
    const response = await api.post<ApiResponse<CreatedUserData>>(
      "/user",
      params,
    );

    const { message, data } = response.data;

    return {
      message,
      user: data.createdUser,
    };
  });

export const updateUser = async (
  params: UpdateUserRequest,
): Promise<UpdateUserResponse> =>
  withApiHandler(async () => {
    const { id, ...body } = params;
    const response = await api.patch<ApiResponse<UpdatedUserData>>(
      `/user/${id}`,
      body,
    );

    const { message, data } = response.data;

    return {
      message,
      user: data.updatedUser,
    };
  });

export const deleteUser = async (
  params: DeleteUserRequest,
): Promise<DeleteUserResponse> =>
  withApiHandler(async () => {
    const { id } = params;
    const response = await api.delete<ApiResponse<DeletedUserData>>(
      `/user/${id}`,
    );

    const { message, data } = response.data;

    return {
      message,
      id: data.id,
    };
  });

export const generatePassword = async (
  params: GeneratePasswordRequest,
): Promise<GeneratePasswordResponse> =>
  withApiHandler(async () => {
    const { id } = params;
    const response = await api.post<ApiResponse<{}>>(
      `/user/${id}/generate-password`,
    );

    return { message: response.data.message };
  });

export const exportUsers = async (
  params: ExportUsersRequest,
): Promise<ExportUsersResponse> =>
  withApiHandler(async () => {
    const response = await api.post<ApiResponse<ExportUsersData>>(
      "/user/export",
      params,
    );

    const { message, data } = response.data;

    return {
      message,
      messageId: data.messageId,
      userCount: data.userCount,
      recipientEmail: data.recipientEmail,
    };
  });

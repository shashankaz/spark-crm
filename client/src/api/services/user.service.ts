import { api } from "@/api";
import { buildQueryParams } from "@/api/query-params";
import type { User } from "@/types";

export type GetAllUsersResponse = {
  message: string;
  users: User[];
  totalCount: number;
};

export type GetUserByIdResponse = {
  message: string;
  user: User;
};

export type CreateUserResponse = {
  message: string;
  user: User;
};

export type UpdateUserResponse = {
  message: string;
  user: User;
};

export type DeleteUserResponse = {
  message: string;
  id: string;
};

export const getAllUsers = async ({
  cursor,
  limit = 10,
  search,
}: {
  cursor?: string;
  limit?: number;
  search?: string;
}): Promise<GetAllUsersResponse> => {
  try {
    const query = buildQueryParams({ cursor, limit, search });
    const response = await api.get(`/user${query ? `?${query}` : ""}`);

    const { message } = response.data;
    const { users, totalCount } = response.data.data;

    return { message, users, totalCount };
  } catch (error) {
    console.error("Get all users error:", error);
    throw error;
  }
};

export const getUserById = async ({
  id,
}: {
  id: string;
}): Promise<GetUserByIdResponse> => {
  try {
    const response = await api.get(`/user/${id}`);

    const { message } = response.data;
    const { user } = response.data.data;

    return { message, user };
  } catch (error) {
    console.error("Get user by ID error:", error);
    throw error;
  }
};

export const createUser = async ({
  firstName,
  lastName,
  email,
  mobile,
  password,
  role,
}: {
  firstName: string;
  lastName?: string;
  email: string;
  mobile?: string;
  password: string;
  role?: string;
}): Promise<CreateUserResponse> => {
  try {
    const response = await api.post("/user", {
      firstName,
      lastName,
      email,
      mobile,
      password,
      role,
    });

    const { message } = response.data;
    const { createdUser } = response.data.data;

    return { message, user: createdUser };
  } catch (error) {
    console.error("Create user error:", error);
    throw error;
  }
};

export const updateUser = async ({
  id,
  firstName,
  lastName,
  email,
  mobile,
  password,
  role,
}: {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  password?: string;
  role?: string;
}): Promise<UpdateUserResponse> => {
  try {
    const response = await api.patch(`/user/${id}`, {
      firstName,
      lastName,
      email,
      mobile,
      password,
      role,
    });

    const { message } = response.data;
    const { updatedUser } = response.data.data;

    return { message, user: updatedUser };
  } catch (error) {
    console.error("Update user error:", error);
    throw error;
  }
};

export const deleteUser = async ({
  id,
}: {
  id: string;
}): Promise<DeleteUserResponse> => {
  try {
    const response = await api.delete(`/user/${id}`);

    const { message } = response.data;
    const { id: deletedId } = response.data.data;

    return { message, id: deletedId };
  } catch (error) {
    console.error("Delete user error:", error);
    throw error;
  }
};

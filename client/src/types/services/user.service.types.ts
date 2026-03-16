import type { User } from "@/types/domain";

/**
 * API response types
 */

export type UsersData = {
  users: User[];
  totalCount: number;
};

export type UserData = {
  user: User;
};

export type CreatedUserData = {
  createdUser: User;
};

export type UpdatedUserData = {
  updatedUser: User;
};

export type DeletedUserData = {
  id: string;
};

export type ExportUsersData = {
  messageId: string;
  userCount: number;
  recipientEmail: string;
};

/**
 * Request types
 */

export type GetAllUsersRequest = {
  cursor?: string;
  limit?: number;
  search?: string;
  role?: string;
};

export type GetUserByIdRequest = {
  id: string;
};

export type CreateUserRequest = {
  firstName: string;
  lastName?: string;
  email: string;
  mobile?: string;
  password: string;
  role?: string;
};

export type UpdateUserRequest = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  password?: string;
  role?: string;
};

export type DeleteUserRequest = {
  id: string;
};

export type ExportUsersRequest = {
  userIds: string[];
  recipientEmail: string;
};

/**
 * Response types
 */

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

export type ExportUsersResponse = {
  message: string;
  messageId: string;
  userCount: number;
  recipientEmail: string;
};

export type GeneratePasswordRequest = {
  id: string;
};

export type GeneratePasswordResponse = {
  message: string;
};

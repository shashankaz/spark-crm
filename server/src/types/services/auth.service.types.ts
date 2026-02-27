import { Types } from "mongoose";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface LogoutInput {
  userId: Types.ObjectId;
}

export interface GetUserProfileInput {
  id: Types.ObjectId;
}

export interface GetUserSessionsInput {
  id: Types.ObjectId;
}

export interface EditProfileInput {
  id: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  mobile?: string;
}

export interface ChangePasswordInput {
  id: Types.ObjectId;
  currentPassword: string;
  newPassword: string;
}

export interface UserResponse {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  role: string;
  createdAt?: string;
  updatedAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

import { Types } from "mongoose";

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IRefreshTokenInput {
  refreshToken: string;
}

export interface ILogoutInput {
  userId: Types.ObjectId;
}

export interface IGetUserProfileInput {
  id: Types.ObjectId;
}

export interface IGetUserSessionsInput {
  id: Types.ObjectId;
}

export interface IEditProfileInput {
  id: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  mobile?: string;
}

export interface IChangePasswordInput {
  id: Types.ObjectId;
  currentPassword: string;
  newPassword: string;
}

export interface IUserResponse {
  _id: Types.ObjectId;
  firstName: string;
  lastName?: string;
  email: string;
  mobile?: string;
  role: string;
  createdAt?: string;
  updatedAt: string;
}

export interface ILoginResponse {
  userId: Types.ObjectId;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

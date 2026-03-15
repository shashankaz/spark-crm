import type { User, Session } from "@/types/domain";

export type SessionsData = {
  sessions: Session[];
};

export type LoginData = {
  userId: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type VerifyOtpRequest = {
  userId: string;
  otp: string;
};

export type ResendOtpRequest = {
  userId: string;
};

export type EditProfileRequest = {
  firstName?: string;
  lastName?: string;
  mobile?: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type LoginResponse = {
  message: string;
  userId: string;
};

export type VerifyOtpResponse = {
  message: string;
};

export type ResendOtpResponse = {
  message: string;
};

export type RefreshTokenResponse = {
  message: string;
};

export type LogoutResponse = {
  message: string;
};

export type GetProfileResponse = {
  message: string;
  user: User;
};

export type GetSessionsResponse = {
  message: string;
  sessions: Session[];
};

export type EditProfileResponse = {
  message: string;
  user: User;
};

export type ChangePasswordResponse = {
  message: string;
};

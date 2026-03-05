import { api } from "@/api";
import { withApiHandler } from "@/api/api-handler";
import type { ApiResponse } from "@/api/api-response";
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  EditProfileRequest,
  EditProfileResponse,
  GetProfileResponse,
  GetSessionsResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  SessionsData,
  UserData,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "@/types/services";

export const login = async (params: LoginRequest): Promise<LoginResponse> =>
  withApiHandler(async () => {
    const response = await api.post<ApiResponse<{ userId: string }>>(
      "/auth/login",
      params,
    );

    const { message, data } = response.data;

    return {
      message,
      userId: data.userId,
    };
  });

export const verifyOtp = async (
  params: VerifyOtpRequest,
): Promise<VerifyOtpResponse> =>
  withApiHandler(async () => {
    const response = await api.post<ApiResponse<void>>(
      "/auth/verify-otp",
      params,
    );

    return {
      message: response.data.message,
    };
  });

export const resendOtp = async (
  params: ResendOtpRequest,
): Promise<ResendOtpResponse> =>
  withApiHandler(async () => {
    const response = await api.post<ApiResponse<void>>(
      "/auth/resend-otp",
      params,
    );

    return {
      message: response.data.message,
    };
  });

export const refreshToken = async (): Promise<RefreshTokenResponse> =>
  withApiHandler(async () => {
    const response = await api.post<ApiResponse<void>>("/auth/refresh");

    return {
      message: response.data.message,
    };
  });

export const logout = async (): Promise<LogoutResponse> =>
  withApiHandler(async () => {
    const response = await api.post<ApiResponse<void>>("/auth/logout");

    return {
      message: response.data.message,
    };
  });

export const getProfile = async (): Promise<GetProfileResponse> =>
  withApiHandler(async () => {
    const response = await api.get<ApiResponse<UserData>>("/auth/profile");

    const { message, data } = response.data;

    return {
      message,
      user: data.user,
    };
  });

export const getSessions = async (): Promise<GetSessionsResponse> =>
  withApiHandler(async () => {
    const response = await api.get<ApiResponse<SessionsData>>("/auth/sessions");

    const { message, data } = response.data;

    return {
      message,
      sessions: data.sessions,
    };
  });

export const editProfile = async (
  params: EditProfileRequest,
): Promise<EditProfileResponse> =>
  withApiHandler(async () => {
    const response = await api.patch<ApiResponse<UserData>>(
      "/auth/profile",
      params,
    );

    const { message, data } = response.data;

    return {
      message,
      user: data.user,
    };
  });

export const changePassword = async (
  params: ChangePasswordRequest,
): Promise<ChangePasswordResponse> =>
  withApiHandler(async () => {
    const response = await api.post<ApiResponse<void>>(
      "/auth/change-password",
      params,
    );

    return {
      message: response.data.message,
    };
  });

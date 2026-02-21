import { api } from "@/api";
import type { User, Session } from "@/types";

export type LoginResponse = {
  message: string;
  user: User;
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

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { message } = response.data;
    const { user } = response.data.data;

    return { message, user };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  try {
    const response = await api.post("/auth/refresh");

    const { message } = response.data;

    return { message };
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error;
  }
};

export const logout = async (): Promise<LogoutResponse> => {
  try {
    const response = await api.post("/auth/logout");

    const { message } = response.data;

    return { message };
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const getProfile = async (): Promise<GetProfileResponse> => {
  try {
    const response = await api.get("/auth/profile");

    const { message } = response.data;
    const { user } = response.data.data;

    return { message, user };
  } catch (error) {
    console.error("Get profile error:", error);
    throw error;
  }
};

export const getSessions = async (): Promise<GetSessionsResponse> => {
  try {
    const response = await api.get("/auth/sessions");

    const { message } = response.data;
    const { sessions } = response.data.data;

    return { message, sessions };
  } catch (error) {
    console.error("Get sessions error:", error);
    throw error;
  }
};

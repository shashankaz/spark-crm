export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface LogoutInput {
  userId: string;
}

export interface GetUserProfileInput {
  id: string;
}

export interface GetUserSessionsInput {
  id: string;
}

export interface EditProfileInput {
  id: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
}

export interface ChangePasswordInput {
  id: string;
  currentPassword: string;
  newPassword: string;
}

export interface UserResponse {
  _id: string;
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

export interface RefreshTokenPayload {
  _id: string;
  iat?: number;
  exp?: number;
}

import { format } from "date-fns";
import { Types } from "mongoose";
import { DeleteResult } from "mongodb";
import { Session } from "../models/session.model";
import { User } from "../models/user.model";
import { AppError } from "../shared/app-error";
import {
  hashPassword,
  hashRefreshToken,
  verifyPassword,
  verifyRefreshTokenHash,
} from "../utils/auth/bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/auth/jwt";
import { sendPasswordChangedMail } from "./email.service";
import {
  LoginInput,
  LoginResponse,
  RefreshTokenInput,
  RefreshTokenResponse,
  LogoutInput,
  GetUserProfileInput,
  GetUserSessionsInput,
  EditProfileInput,
  ChangePasswordInput,
  UserResponse,
} from "../types/services/auth.service.types";

export const loginService = async ({
  email,
  password,
}: LoginInput): Promise<LoginResponse> => {
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );

  if (!user || !user.password) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const session = await Session.create({
    userId: user._id,
  });

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(session._id.toString());

  if (!accessToken || !refreshToken) {
    throw new AppError("Failed to generate tokens", 500);
  }

  const hashedRefreshToken = await hashRefreshToken(refreshToken);

  await Session.findByIdAndUpdate(session._id, {
    token: hashedRefreshToken,
  });

  const responseUser: UserResponse = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName ?? "-",
    email: user.email,
    mobile: user.mobile ?? "-",
    role: user.role,
    createdAt: format(user.createdAt, "dd/MM/yyyy"),
    updatedAt: format(user.updatedAt, "dd/MM/yyyy"),
  };

  return {
    accessToken,
    refreshToken,
    user: responseUser,
  };
};

export const refreshAuthTokenService = async ({
  refreshToken,
}: RefreshTokenInput): Promise<RefreshTokenResponse> => {
  const payload = verifyRefreshToken(refreshToken);

  if (!payload || !payload._id) {
    throw new AppError("Invalid refresh token", 401);
  }

  const session = await Session.findById(payload._id);

  if (!session || !session.token) {
    throw new AppError("Session not found", 401);
  }

  const isTokenValid = await verifyRefreshTokenHash(
    refreshToken,
    session.token,
  );

  if (!isTokenValid) {
    throw new AppError("Refresh token invalid or expired", 401);
  }

  const newAccessToken = generateAccessToken(session.userId.toString());
  const newRefreshToken = generateRefreshToken(session._id.toString());

  if (!newAccessToken || !newRefreshToken) {
    throw new AppError("Failed to generate tokens", 500);
  }

  const hashedNewRefreshToken = await hashRefreshToken(newRefreshToken);

  await Session.findByIdAndUpdate(session._id, {
    token: hashedNewRefreshToken,
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutService = async ({
  userId,
}: LogoutInput): Promise<DeleteResult> => {
  return await Session.deleteMany({
    userId: new Types.ObjectId(userId),
  });
};

export const getUserProfileService = async ({
  id,
}: GetUserProfileInput): Promise<UserResponse> => {
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName ?? "-",
    email: user.email,
    mobile: user.mobile ?? "-",
    role: user.role,
    createdAt: format(user.createdAt, "dd/MM/yyyy"),
    updatedAt: format(user.updatedAt, "dd/MM/yyyy"),
  };
};

export const getUserSessionsService = async ({ id }: GetUserSessionsInput) => {
  return await Session.find({
    userId: new Types.ObjectId(id),
  })
    .sort({ _id: -1 })
    .limit(10);
};

export const editProfileService = async ({
  id,
  firstName,
  lastName,
  mobile,
}: EditProfileInput): Promise<UserResponse> => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (mobile) user.mobile = mobile;

  await user.save();

  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName ?? "-",
    email: user.email,
    mobile: user.mobile ?? "-",
    role: user.role,
    updatedAt: format(user.updatedAt, "dd/MM/yyyy"),
  };
};

export const changePasswordService = async ({
  id,
  currentPassword,
  newPassword,
}: ChangePasswordInput): Promise<void> => {
  const user = await User.findById(id).select("+password");

  if (!user || !user.password) {
    throw new AppError("User not found", 404);
  }

  const isMatch = await verifyPassword(currentPassword, user.password);

  if (!isMatch) {
    throw new AppError("Current password is incorrect", 401);
  }

  user.password = await hashPassword(newPassword);

  await user.save();

  await sendPasswordChangedMail({
    userEmail: user.email,
    userName: user.firstName,
  });
};

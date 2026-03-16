import { format } from "date-fns";
import { Types } from "mongoose";
import { DeleteResult } from "mongodb";
import { Session } from "../models/session.model";
import { Tenant } from "../../tenant/models/tenant.model";
import { User } from "../../user/models/user.model";
import { AppError } from "../../../shared/app-error";
import {
  hashPassword,
  hashRefreshToken,
  verifyPassword,
  verifyRefreshTokenHash,
} from "../../../utils/auth/bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../utils/auth/jwt";
import { redis } from "../../../utils/redis";
import {
  sendPasswordChangedMail,
  sendOtpMail,
} from "../../../utils/mail/email.helper";
import {
  ILoginInput,
  ILoginResponse,
  IRefreshTokenInput,
  IRefreshTokenResponse,
  ILogoutInput,
  IGetUserProfileInput,
  IGetUserSessionsInput,
  IEditProfileInput,
  IChangePasswordInput,
  IUserResponse,
} from "./auth.service.types";

export const loginService = async ({
  email,
  password,
}: ILoginInput): Promise<ILoginResponse> => {
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );

  if (!user || !user.password) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.role !== "super_admin") {
    const tenant = await Tenant.findOne({
      _id: user.tenantId,
      isDeleted: false,
    });
    if (!tenant) {
      throw new AppError("Tenant not found or has been deleted", 403);
    }
  }

  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const otp = await redis.get(`otp:${user._id}`);
  if (otp) {
    await redis.del(`otp:${user._id}`);
  }

  const newOtp = Number(Math.floor(100000 + Math.random() * 900000).toString());

  const payload = {
    otp: newOtp,
  };

  await redis.set(`otp:${user._id}`, JSON.stringify(payload), "EX", 600);

  await sendOtpMail({
    userEmail: user.email,
    userName: user.firstName,
    otp: newOtp,
  });

  return { userId: user._id };
};

export const refreshAuthTokenService = async ({
  refreshToken,
}: IRefreshTokenInput): Promise<IRefreshTokenResponse> => {
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
}: ILogoutInput): Promise<DeleteResult> => {
  return await Session.deleteMany({
    userId: new Types.ObjectId(userId),
  });
};

export const verifyOTPService = async ({
  userId,
  otp,
}: {
  userId: string;
  otp: string;
}) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("Unauthorized", 401);
  }

  const userData = await redis.get(`otp:${userId}`);
  if (!userData) {
    throw new AppError("OTP expired or not found", 400);
  }

  const parsedUserData = JSON.parse(userData);
  if (!parsedUserData || parsedUserData.otp !== Number(otp)) {
    throw new AppError("Invalid OTP", 400);
  }

  const session = await Session.create({
    userId,
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

  await redis.del(`otp:${userId}`);

  return {
    accessToken,
    refreshToken,
  };
};

export const resendOtpService = async ({
  userId,
}: {
  userId: string;
}): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  await redis.del(`otp:${userId}`);

  const newOtp = Number(Math.floor(100000 + Math.random() * 900000).toString());

  await redis.set(`otp:${userId}`, JSON.stringify({ otp: newOtp }), "EX", 600);

  await sendOtpMail({
    userEmail: user.email,
    userName: user.firstName,
    otp: newOtp,
  });
};

export const getUserProfileService = async ({
  id,
}: IGetUserProfileInput): Promise<IUserResponse> => {
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName ?? undefined,
    email: user.email,
    mobile: user.mobile ?? undefined,
    role: user.role,
    createdAt: format(user.createdAt, "dd/MM/yyyy"),
    updatedAt: format(user.updatedAt, "dd/MM/yyyy"),
  };
};

export const getUserSessionsService = async ({ id }: IGetUserSessionsInput) => {
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
}: IEditProfileInput): Promise<IUserResponse> => {
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
}: IChangePasswordInput): Promise<void> => {
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

  await Session.deleteMany({ userId: new Types.ObjectId(id) });

  await sendPasswordChangedMail({
    userEmail: user.email,
    userName: user.firstName,
  });
};

import { formatDate } from "date-fns";
import { Session } from "../models/session.model.js";
import { User } from "../models/user.model.js";
import { AppError } from "../shared/app-error.js";
import {
  hashPassword,
  hashRefreshToken,
  verifyPassword,
  verifyRefreshTokenHash,
} from "../utils/auth/bcrypt.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/auth/jwt.js";

export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );
  if (!user) throw new AppError("Invalid email or password", 401);

  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) throw new AppError("Invalid email or password", 401);

  const session = await Session.create({ userId: user._id });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(session._id);

  if (!accessToken || !refreshToken)
    throw new AppError("Failed to generate tokens", 500);

  const hashedRefreshToken = await hashRefreshToken(refreshToken);
  await Session.findByIdAndUpdate(session._id, { token: hashedRefreshToken });

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      createdAt: formatDate(user.createdAt, "dd/MM/yyyy"),
      updatedAt: formatDate(user.updatedAt, "dd/MM/yyyy"),
    },
  };
};

export const refreshAuthTokenService = async ({ refreshToken }) => {
  const payload = verifyRefreshToken(refreshToken);
  if (!payload || !payload._id) {
    throw new AppError("Invalid refresh token", 401);
  }

  const session = await Session.findById(payload._id);
  if (!session) {
    throw new AppError("Session not found", 401);
  }

  const isTokenValid = await verifyRefreshTokenHash(
    refreshToken,
    session.token,
  );
  if (!isTokenValid) {
    throw new AppError("Refresh token invalid or expired", 401);
  }

  const newAccessToken = generateAccessToken(session.userId);
  const newRefreshToken = generateRefreshToken(session._id);
  const hashedNewRefreshToken = await hashRefreshToken(newRefreshToken);

  await Session.findByIdAndUpdate(session._id, {
    token: hashedNewRefreshToken,
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logoutService = async ({ userId }) => {
  return await Session.deleteMany({ userId });
};

export const getUserProfileService = async ({ id }) => {
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    createdAt: formatDate(user.createdAt, "dd/MM/yyyy"),
    updatedAt: formatDate(user.updatedAt, "dd/MM/yyyy"),
  };
};

export const getUserSessionsService = async ({ id }) => {
  return await Session.find({ userId: id }).sort({ _id: -1 }).limit(10);
};

export const editProfileService = async ({
  id,
  firstName,
  lastName,
  mobile,
}) => {
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
    lastName: user.lastName,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    updatedAt: formatDate(user.updatedAt, "dd/MM/yyyy"),
  };
};

export const changePasswordService = async ({
  id,
  currentPassword,
  newPassword,
}) => {
  const user = await User.findById(id).select("+password");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isMatch = await verifyPassword(currentPassword, user.password);
  if (!isMatch) {
    throw new AppError("Current password is incorrect", 401);
  }

  user.password = await hashPassword(newPassword);
  await user.save();
};

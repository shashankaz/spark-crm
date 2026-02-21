import { Session } from "../models/session.model.js";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import {
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
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
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

  return user;
};

export const getUserSessionsService = async ({ id }) => {
  return await Session.find({ userId: id }).sort({ createdAt: -1 }).limit(10);
};

import {
  loginService,
  refreshAuthTokenService,
  logoutService,
  getUserProfileService,
  getUserSessionsService,
  editProfileService,
  changePasswordService,
} from "../services/auth.service.js";
import { isProduction } from "../config/env.js";
import { AppError } from "../shared/app-error.js";
import { sendSuccess } from "../shared/api-response.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const { accessToken, refreshToken, user } = await loginService({
      email,
      password,
    });

    res.cookie("__auth_at", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 1000 * 60 * 15, // 15 minutes
    });

    res.cookie("__auth_rt", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    sendSuccess(res, 200, "Login successful", { user });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const rt = req.cookies["__auth_rt"];
    if (!rt) {
      throw new AppError("Refresh token is missing", 401);
    }

    const { accessToken, refreshToken } = await refreshAuthTokenService({
      refreshToken: rt,
    });

    res.cookie("__auth_at", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 1000 * 60 * 15,
    });

    res.cookie("__auth_rt", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    sendSuccess(res, 200, "Token refreshed successfully", {});
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await logoutService({ userId: req.user._id });

    res.clearCookie("__auth_at");
    res.clearCookie("__auth_rt");

    sendSuccess(res, 200, "Logout successful", {});
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await getUserProfileService({ id: req.user._id });

    sendSuccess(res, 200, "Profile retrieved successfully", { user });
  } catch (error) {
    next(error);
  }
};

export const getSessions = async (req, res, next) => {
  try {
    const sessions = await getUserSessionsService({ id: req.user._id });

    sendSuccess(res, 200, "Sessions retrieved successfully", { sessions });
  } catch (error) {
    next(error);
  }
};

export const editProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, mobile } = req.body;
    if (!firstName && !lastName && !mobile) {
      throw new AppError(
        "At least one field (firstName, lastName, or mobile) is required",
        400,
      );
    }

    const updatedUser = await editProfileService({
      id: req.user._id,
      firstName,
      lastName,
      mobile,
    });

    sendSuccess(res, 200, "Profile updated successfully", {
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new AppError("Current password and new password are required", 400);
    }

    if (currentPassword === newPassword) {
      throw new AppError(
        "New password must be different from current password",
        400,
      );
    }

    await changePasswordService({
      id: req.user._id,
      currentPassword,
      newPassword,
    });

    sendSuccess(res, 200, "Password changed successfully", {});
  } catch (error) {
    next(error);
  }
};

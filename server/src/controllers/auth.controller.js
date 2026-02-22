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

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
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

    res.json({
      success: true,
      message: "Login successful",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const rt = req.cookies["__auth_rt"];
    if (!rt) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token missing" });
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

    res.json({
      success: true,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await logoutService({ userId: req.user._id });

    res.clearCookie("__auth_at");
    res.clearCookie("__auth_rt");

    res.json({ success: true, message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await getUserProfileService({ id: req.user._id });

    res.json({
      success: true,
      message: "Profile retrieved successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const getSessions = async (req, res, next) => {
  try {
    const sessions = await getUserSessionsService({ id: req.user._id });

    res.json({
      success: true,
      message: "Sessions retrieved successfully",
      data: { sessions },
    });
  } catch (error) {
    next(error);
  }
};

export const editProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, mobile } = req.body;
    if (!firstName && !lastName && !mobile) {
      return res.status(400).json({
        success: false,
        message:
          "At least one field (firstName, lastName, or mobile) is required",
      });
    }

    const updatedUser = await editProfileService({
      id: req.user._id,
      firstName,
      lastName,
      mobile,
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    await changePasswordService({
      id: req.user._id,
      currentPassword,
      newPassword,
    });

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

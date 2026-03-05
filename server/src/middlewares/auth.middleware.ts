import { NextFunction, Request, Response } from "express";
import { Tenant } from "../models/tenant.model";
import { User } from "../models/user.model";
import { verifyAccessToken } from "../utils/auth/jwt";
import { AppError } from "../shared/app-error";

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const accessToken = req.cookies["__auth_at"];
    if (!accessToken) {
      throw new AppError("Unauthorized", 401);
    }

    const decoded = verifyAccessToken(accessToken);
    if (!decoded || !decoded._id) {
      throw new AppError("Unauthorized", 401);
    }

    const userData = await User.findOne({ _id: decoded._id });
    if (!userData) {
      throw new AppError("User not found", 404);
      return;
    }

    if (userData.role !== "super_admin") {
      const tenant = await Tenant.findOne({
        _id: userData.tenantId,
        isDeleted: false,
      });
      if (!tenant) {
        throw new AppError("Tenant not found or has been deleted", 403);
      }
    }

    req.user = Object.freeze(userData.toJSON());

    next();
  } catch (error) {
    next(error);
  }
};

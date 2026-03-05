import { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/app-error";

export const requireSuperAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    if (req.user.role !== "super_admin") {
      throw new AppError("Forbidden", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      throw new AppError("Forbidden", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

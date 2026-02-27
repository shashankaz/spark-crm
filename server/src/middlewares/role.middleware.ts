import { Request, Response, NextFunction } from "express";

export const requireSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    if (req.user.role !== "super_admin") {
      res.status(403).json({ success: false, message: "Forbidden" });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      res
        .status(403)
        .json({ success: false, message: "Forbidden: Admin access required" });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

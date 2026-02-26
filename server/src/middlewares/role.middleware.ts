export const requireSuperAdmin = (req, res, next) => {
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

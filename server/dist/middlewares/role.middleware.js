"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSuperAdmin = void 0;
const requireSuperAdmin = (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
};
exports.requireSuperAdmin = requireSuperAdmin;

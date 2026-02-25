import { Router } from "express";
import authRoutes from "./v1/auth.routes.js";
import tenantRoutes from "./v1/tenant.routes.js";
import leadRoutes from "./v1/lead.routes.js";
import organizationRoutes from "./v1/organization.routes.js";
import userRoutes from "./v1/user.routes.js";
import callRoutes from "./v1/call.routes.js";
import commentRoutes from "./v1/comment.routes.js";
import dealRoutes from "./v1/deal.routes.js";
import dashboardRoutes from "./v1/dashboard.route.js";

export const router = Router();

router.use("/auth", authRoutes);
router.use("/tenant", tenantRoutes);
router.use("/lead", leadRoutes);
router.use("/organization", organizationRoutes);
router.use("/deal", dealRoutes);
router.use("/user", userRoutes);
router.use("/call", callRoutes);
router.use("/comment", commentRoutes);
router.use("/dashboard", dashboardRoutes);

import { Router } from "express";
import authRoutes from "./v1/auth.routes";
import tenantRoutes from "./v1/tenant.routes";
import leadRoutes from "./v1/lead.routes";
import organizationRoutes from "./v1/organization.routes";
import userRoutes from "./v1/user.routes";
import callRoutes from "./v1/call.routes";
import commentRoutes from "./v1/comment.routes";
import dealRoutes from "./v1/deal.routes";
import dashboardRoutes from "./v1/dashboard.route";
import uploadRoutes from "./v1/upload.routes";
import attachmentRoutes from "./v1/attachment.routes";

export const router = Router();

router.use("/auth", authRoutes);
router.use("/tenant", tenantRoutes);
router.use("/lead", leadRoutes);
router.use("/organization", organizationRoutes);
router.use("/deal", dealRoutes);
router.use("/user", userRoutes);
router.use("/call", callRoutes);
router.use("/comment", commentRoutes);
router.use("/attachment", attachmentRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/upload", uploadRoutes);

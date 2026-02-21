import { Router } from "express";
import {
  getTenantDashboardStats,
  getAllTenants,
  getTenantById,
  createTenant,
  updateTenantById,
  deleteTenantById,
  createUserForTenant,
} from "../../controllers/tenant.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireSuperAdmin } from "../../middlewares/role.middleware.js";

const router = Router();

router.get(
  "/dashboard",
  requireAuth,
  requireSuperAdmin,
  getTenantDashboardStats,
);

router.get("/", requireAuth, requireSuperAdmin, getAllTenants);
router.get("/:id", requireAuth, requireSuperAdmin, getTenantById);
router.post("/", requireAuth, requireSuperAdmin, createTenant);
router.patch("/:id", requireAuth, requireSuperAdmin, updateTenantById);
router.delete("/:id", requireAuth, requireSuperAdmin, deleteTenantById);

router.post("/:id/user", requireAuth, requireSuperAdmin, createUserForTenant);

export default router;

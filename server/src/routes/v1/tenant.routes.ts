import { Router } from "express";
import {
  getTenantDashboardStats,
  getAllTenants,
  getTenantById,
  getAvailableSlug,
  createTenant,
  updateTenantById,
  deleteTenantById,
  createUserForTenant,
  getUsersByTenantId,
  exportTenants,
} from "../../controllers/tenant.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requireSuperAdmin } from "../../middlewares/role.middleware";

const router = Router();

router.use(requireAuth);
router.use(requireSuperAdmin);

router.get("/dashboard", getTenantDashboardStats);

router.get("/", getAllTenants);
router.get("/:id", getTenantById);
router.get("/:id/users", getUsersByTenantId);
router.get("/slug/:slug", getAvailableSlug);
router.post("/", createTenant);
router.post("/export", exportTenants);
router.patch("/:id", updateTenantById);
router.delete("/:id", deleteTenantById);

router.post("/:id/user", createUserForTenant);

export default router;

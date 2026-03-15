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
  getTenantGrowth,
  getAdminRevenue,
  getPlanDistributionChart,
  getUserGrowth,
  getTopTenantsByPlan,
} from "./tenant.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requireSuperAdmin } from "../../middlewares/role.middleware";

const router = Router();

router.use(requireAuth);
router.use(requireSuperAdmin);

router.get("/dashboard", getTenantDashboardStats);
router.get("/dashboard/tenant-growth", getTenantGrowth);
router.get("/dashboard/admin-revenue", getAdminRevenue);
router.get("/dashboard/plan-distribution-chart", getPlanDistributionChart);
router.get("/dashboard/user-growth", getUserGrowth);
router.get("/dashboard/top-tenants", getTopTenantsByPlan);

router.get("/slug/:slug", getAvailableSlug);

router.get("/", getAllTenants);
router.post("/", createTenant);
router.post("/export", exportTenants);

router.get("/:id", getTenantById);
router.get("/:id/users", getUsersByTenantId);
router.patch("/:id", updateTenantById);
router.delete("/:id", deleteTenantById);
router.post("/:id/user", createUserForTenant);

export default router;

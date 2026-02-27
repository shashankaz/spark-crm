import { Router } from "express";
import {
  getTenantDashboardStats,
  getAllTenants,
  getTenantById,
  createTenant,
  updateTenantById,
  deleteTenantById,
  createUserForTenant,
  getUsersByTenantId,
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
router.post("/", createTenant);
router.patch("/:id", updateTenantById);
router.delete("/:id", deleteTenantById);

router.post("/:id/user", createUserForTenant);

export default router;

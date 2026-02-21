import { Router } from "express";
import {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganizationById,
  deleteOrganizationById,
} from "../../controllers/organization.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getAllOrganizations);
router.get("/:id", requireAuth, getOrganizationById);
router.post("/", requireAuth, createOrganization);
router.patch("/:id", requireAuth, updateOrganizationById);
router.delete("/:id", requireAuth, deleteOrganizationById);

export default router;

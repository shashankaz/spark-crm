import { Router } from "express";
import {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganizationById,
  deleteOrganizationById,
  exportOrganizations,
} from "./organization.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/", getAllOrganizations);
router.get("/:id", getOrganizationById);
router.post("/", createOrganization);
router.post("/export", exportOrganizations);
router.patch("/:id", updateOrganizationById);
router.delete("/:id", deleteOrganizationById);

export default router;

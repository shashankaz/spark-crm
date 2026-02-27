import { Router } from "express";
import {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganizationById,
  deleteOrganizationById,
} from "../../controllers/organization.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/", getAllOrganizations);
router.get("/:id", getOrganizationById);
router.post("/", createOrganization);
router.patch("/:id", updateOrganizationById);
router.delete("/:id", deleteOrganizationById);

export default router;

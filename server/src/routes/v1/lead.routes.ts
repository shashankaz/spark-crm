import { Router } from "express";
import {
  getAllLeads,
  getLeadById,
  createLead,
  updateLeadById,
  deleteLeadById,
  getAllOrganizations,
  bulkWriteLeads,
  convertLeadToDeal,
  getLeadActivityByLeadId,
  assignLead,
  exportLeads,
} from "../../controllers/lead.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requireAdmin } from "../../middlewares/role.middleware";

const router = Router();

router.use(requireAuth);

router.get("/", getAllLeads);
router.get("/organizations", getAllOrganizations);
router.get("/activity/:id", getLeadActivityByLeadId);
router.get("/:id", getLeadById);
router.post("/", createLead);
router.post("/bulk", bulkWriteLeads);
router.post("/export", exportLeads);
router.post("/:id/convert", convertLeadToDeal);
router.patch("/:id", updateLeadById);
router.delete("/:id", deleteLeadById);

router.patch("/:id/assign", requireAdmin, assignLead);

export default router;

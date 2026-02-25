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
} from "../../controllers/lead.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", getAllLeads);
router.get("/organizations", getAllOrganizations);
router.get("/activity/:id", getLeadActivityByLeadId);
router.get("/:id", getLeadById);
router.post("/", createLead);
router.post("/bulk", bulkWriteLeads);
router.post("/:id/convert", convertLeadToDeal);
router.patch("/:id", updateLeadById);
router.delete("/:id", deleteLeadById);

export default router;

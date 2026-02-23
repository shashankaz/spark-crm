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

router.get("/", requireAuth, getAllLeads);
router.get("/organizations", requireAuth, getAllOrganizations);
router.get("/activity/:id", requireAuth, getLeadActivityByLeadId);
router.get("/:id", requireAuth, getLeadById);
router.post("/", requireAuth, createLead);
router.post("/bulk", requireAuth, bulkWriteLeads);
router.post("/:id/convert", requireAuth, convertLeadToDeal);
router.patch("/:id", requireAuth, updateLeadById);
router.delete("/:id", requireAuth, deleteLeadById);

export default router;

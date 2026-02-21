import { Router } from "express";
import {
  getAllLeads,
  getLeadById,
  createLead,
  updateLeadById,
  deleteLeadById,
} from "../../controllers/lead.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getAllLeads);
router.get("/:id", requireAuth, getLeadById);
router.post("/", requireAuth, createLead);
router.patch("/:id", requireAuth, updateLeadById);
router.delete("/:id", requireAuth, deleteLeadById);

export default router;

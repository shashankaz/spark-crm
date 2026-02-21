import { Router } from "express";
import {
  getAllCallsByLeadId,
  createCallForLead,
} from "../../controllers/call.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/:leadId", requireAuth, getAllCallsByLeadId);
router.post("/:leadId", requireAuth, createCallForLead);

export default router;

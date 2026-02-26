import { Router } from "express";
import {
  getAllCallsByLeadId,
  createCallForLead,
} from "../../controllers/call.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/:leadId", getAllCallsByLeadId);
router.post("/:leadId", createCallForLead);

export default router;

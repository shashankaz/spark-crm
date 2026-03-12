import { Router } from "express";
import {
  getAllCallsByLeadId,
  createCallForLead,
} from "./call.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/:leadId", getAllCallsByLeadId);
router.post("/:leadId", createCallForLead);

export default router;

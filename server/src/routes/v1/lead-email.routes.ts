import { Router } from "express";
import {
  getAllEmailsByLeadId,
  sendEmailForLead,
} from "../../controllers/lead-email.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/:leadId", getAllEmailsByLeadId);
router.post("/:leadId", sendEmailForLead);

export default router;

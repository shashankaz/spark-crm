import { Router } from "express";
import {
  getAllAttachmentsByLeadId,
  createAttachmentForLead,
} from "./attachment.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/:leadId", getAllAttachmentsByLeadId);
router.post("/:leadId", createAttachmentForLead);

export default router;

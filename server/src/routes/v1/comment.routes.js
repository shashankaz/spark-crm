import { Router } from "express";
import {
  getAllCommentsByLeadId,
  createCommentForLead,
} from "../../controllers/comment.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/:leadId", requireAuth, getAllCommentsByLeadId);
router.post("/:leadId", requireAuth, createCommentForLead);

export default router;

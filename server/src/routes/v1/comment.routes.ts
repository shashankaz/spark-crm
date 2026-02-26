import { Router } from "express";
import {
  getAllCommentsByLeadId,
  createCommentForLead,
} from "../../controllers/comment.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/:leadId", getAllCommentsByLeadId);
router.post("/:leadId", createCommentForLead);

export default router;

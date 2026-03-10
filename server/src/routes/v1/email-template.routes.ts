import { Router } from "express";
import {
  getEmailTemplates,
  getEmailTemplateById,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
} from "../../controllers/email-template.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/", getEmailTemplates);
router.get("/:id", getEmailTemplateById);
router.post("/", createEmailTemplate);
router.patch("/:id", updateEmailTemplate);
router.delete("/:id", deleteEmailTemplate);

export default router;

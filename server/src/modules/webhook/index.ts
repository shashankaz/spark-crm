import { Router } from "express";
import cors from "cors";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requireAdmin } from "../../middlewares/role.middleware";
import { webhookAuth } from "../../middlewares/webhook-auth.middleware";
import {
  generateWebhookToken,
  listWebhookTokens,
  revokeWebhookToken,
  deleteWebhookToken,
  createLeadFromWebhook,
} from "./webhook.controller";

const router = Router();

const webhookCors = cors({ origin: "*", methods: ["POST", "OPTIONS"] });

router.post("/lead", webhookCors, webhookAuth, createLeadFromWebhook);

router.options("/lead", webhookCors);

router.use(requireAuth, requireAdmin);

router.get("/token", listWebhookTokens);
router.post("/token", generateWebhookToken);
router.patch("/token/:id/revoke", revokeWebhookToken);
router.delete("/token/:id", deleteWebhookToken);

export default router;

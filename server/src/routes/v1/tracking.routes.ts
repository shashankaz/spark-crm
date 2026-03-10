import { Router } from "express";
import {
  trackEmailOpen,
  trackEmailClick,
} from "../../controllers/tracking.controller";

const router = Router();

router.get("/open/:trackingId", trackEmailOpen);
router.get("/click/:trackingId", trackEmailClick);

export default router;

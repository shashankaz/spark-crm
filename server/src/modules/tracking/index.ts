import { Router } from "express";
import cors from "cors";
import { trackEmailOpen, trackEmailClick } from "./tracking.controller";

const router = Router();

const trackingCors = cors({ origin: "*", methods: ["GET", "OPTIONS"] });

router.options("/open/:trackingId", trackingCors);
router.options("/click/:trackingId", trackingCors);

router.get("/open/:trackingId", trackingCors, trackEmailOpen);
router.get("/click/:trackingId", trackingCors, trackEmailClick);

export default router;

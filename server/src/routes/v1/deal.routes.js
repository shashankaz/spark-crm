import { Router } from "express";
import { getAllDeals } from "../../controllers/deal.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getAllDeals);

export default router;

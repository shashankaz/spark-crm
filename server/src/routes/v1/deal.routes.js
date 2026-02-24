import { Router } from "express";
import { deleteDealById, getAllDeals } from "../../controllers/deal.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getAllDeals);
router.delete("/:id", requireAuth, deleteDealById);

export default router;

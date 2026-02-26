import { Router } from "express";
import {
  deleteDealById,
  getAllDeals,
} from "../../controllers/deal.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", getAllDeals);
router.delete("/:id", deleteDealById);

export default router;

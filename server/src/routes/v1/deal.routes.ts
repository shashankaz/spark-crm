import { Router } from "express";
import {
  deleteDealById,
  getAllDeals,
  getDealById,
  updateDealById,
} from "../../controllers/deal.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/", getAllDeals);
router.get("/:id", getDealById);
router.patch("/:id", updateDealById);
router.delete("/:id", deleteDealById);

export default router;

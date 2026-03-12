import { Router } from "express";
import {
  deleteDealById,
  getAllDeals,
  getDealById,
  updateDealById,
  exportDeals,
} from "./deal.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/", getAllDeals);
router.get("/:id", getDealById);
router.post("/export", exportDeals);
router.patch("/:id", updateDealById);
router.delete("/:id", deleteDealById);

export default router;

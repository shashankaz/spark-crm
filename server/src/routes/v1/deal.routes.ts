import { Router } from "express";
import {
  deleteDealById,
  getAllDeals,
} from "../../controllers/deal.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/", getAllDeals);
router.delete("/:id", deleteDealById);

export default router;

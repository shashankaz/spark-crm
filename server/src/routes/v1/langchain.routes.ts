import { Router } from "express";
import { researchLeadController } from "../../controllers/langchain.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.post("/research", researchLeadController);

export default router;

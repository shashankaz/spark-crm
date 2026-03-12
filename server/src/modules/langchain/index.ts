import { Router } from "express";
import { researchLeadController } from "./langchain.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.post("/research", researchLeadController);

export default router;

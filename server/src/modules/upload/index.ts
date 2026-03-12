import { Router } from "express";
import { generateUploadUrl } from "./upload.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, generateUploadUrl);

export default router;

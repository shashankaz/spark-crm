import { Router } from "express";
import { generateUploadUrl } from "../../controllers/upload.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, generateUploadUrl);

export default router;

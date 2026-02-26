import { Router } from "express";
import { generateUploadUrl } from "../../controllers/upload.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, generateUploadUrl);

export default router;

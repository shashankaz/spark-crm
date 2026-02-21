import { Router } from "express";
import {
  login,
  refreshToken,
  logout,
  getProfile,
  getSessions,
} from "../../controllers/auth.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import {
  loginLimiter,
  refreshLimiter,
} from "../../middlewares/rate-limit.middleware.js";

const router = Router();

router.post("/login", loginLimiter, login);
router.post("/refresh", refreshLimiter, refreshToken);
router.post("/logout", requireAuth, logout);

router.get("/profile", requireAuth, getProfile);
router.get("/sessions", requireAuth, getSessions);

export default router;

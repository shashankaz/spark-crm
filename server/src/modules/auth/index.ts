import { Router } from "express";
import {
  login,
  verifyOtp,
  resendOtp,
  refreshToken,
  logout,
  getProfile,
  getSessions,
  editProfile,
  changePassword,
} from "./auth.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { rateLimiter } from "../../middlewares/rate-limit.middleware";

const router = Router();

router.post("/login", rateLimiter(), login);
router.post("/verify-otp", rateLimiter(), verifyOtp);
router.post("/resend-otp", rateLimiter(), resendOtp);
router.post("/refresh", rateLimiter(), refreshToken);

router.use(requireAuth);

router.post("/logout", logout);

router.get("/profile", getProfile);
router.patch("/profile", editProfile);
router.get("/sessions", getSessions);
router.post("/change-password", rateLimiter(), changePassword);

export default router;

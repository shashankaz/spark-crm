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
} from "../../controllers/auth.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { rateLimiter } from "../../middlewares/rate-limit.middleware";

const router = Router();

router.post("/login", rateLimiter({ max: 5 }), login);
router.post("/verify-otp", rateLimiter({ max: 20 }), verifyOtp);
router.post("/resend-otp", rateLimiter({ max: 20 }), resendOtp);
router.post("/refresh", rateLimiter({ max: 20 }), refreshToken);

router.use(requireAuth);

router.post("/logout", logout);

router.get("/profile", getProfile);
router.patch("/profile", editProfile);
router.get("/sessions", getSessions);
router.post("/change-password", rateLimiter({ max: 20 }), changePassword);

export default router;

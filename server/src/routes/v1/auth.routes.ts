import { Router } from "express";
import {
  login,
  refreshToken,
  logout,
  getProfile,
  getSessions,
  editProfile,
  changePassword,
} from "../../controllers/auth.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import {
  loginLimiter,
  refreshLimiter,
} from "../../middlewares/rate-limit.middleware.js";

const router = Router();

router.post("/login", loginLimiter, login);
router.post("/refresh", refreshLimiter, refreshToken);

router.use(requireAuth);

router.post("/logout", logout);

router.get("/profile", getProfile);
router.patch("/profile", editProfile);
router.get("/sessions", getSessions);
router.post("/change-password", changePassword);

export default router;

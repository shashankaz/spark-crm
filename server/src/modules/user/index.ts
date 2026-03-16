import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  exportUsers,
  generatePassword,
} from "./user.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requireAdmin } from "../../middlewares/role.middleware";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.post("/export", exportUsers);
router.post("/:id/generate-password", generatePassword);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;

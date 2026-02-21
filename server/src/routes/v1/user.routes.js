import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../../controllers/user.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getAllUsers);
router.get("/:id", requireAuth, getUserById);
router.post("/", requireAuth, createUser);
router.patch("/:id", requireAuth, updateUser);
router.delete("/:id", requireAuth, deleteUser);

export default router;

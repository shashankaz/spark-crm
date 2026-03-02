import { Router } from "express";
import {
  getAllWorkflows,
  getWorkflowById,
  createWorkflow,
  updateWorkflowById,
  deleteWorkflowById,
  toggleWorkflow,
} from "../../controllers/workflow.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/", getAllWorkflows);
router.get("/:id", getWorkflowById);
router.post("/", createWorkflow);
router.patch("/:id", updateWorkflowById);
router.patch("/:id/toggle", toggleWorkflow);
router.delete("/:id", deleteWorkflowById);

export default router;

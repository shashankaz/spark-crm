import { Router } from "express";
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  toggleStarContact,
  deleteContact,
  bulkDeleteContacts,
} from "./contact.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/", getAllContacts);
router.get("/:id", getContactById);
router.post("/", createContact);
router.post("/bulk-delete", bulkDeleteContacts);
router.patch("/:id", updateContact);
router.patch("/:id/star", toggleStarContact);
router.delete("/:id", deleteContact);

export default router;

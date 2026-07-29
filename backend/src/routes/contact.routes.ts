import { Router } from "express";
import { createContact, getContacts, deleteContact } from "../controllers/contact.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", createContact); // Public
router.get("/", verifyToken, getContacts); // Admin
router.delete("/:id", verifyToken, deleteContact); // Admin

export default router;

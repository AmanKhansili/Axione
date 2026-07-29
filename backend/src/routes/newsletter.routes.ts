import { Router } from "express";
import {
  subscribe,
  getSubscribers,
  deleteSubscriber,
} from "../controllers/newsletter.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", subscribe);
router.get("/", verifyToken, getSubscribers);
router.delete("/:id", verifyToken, deleteSubscriber);

export default router;

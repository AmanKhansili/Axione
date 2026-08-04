import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/stats", verifyToken, getDashboardStats);

export default router;

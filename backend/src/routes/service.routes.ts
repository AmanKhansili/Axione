import { Router } from "express";

import {
  createService,
  getServices,
  getServiceById,
  getServiceBySlug,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getServices);

router.get("/id/:id", verifyToken, getServiceById);

router.get("/:slug", getServiceBySlug);

router.post("/", verifyToken, createService);

router.put("/:id", verifyToken, updateService);

router.delete("/:id", verifyToken, deleteService);

export default router;

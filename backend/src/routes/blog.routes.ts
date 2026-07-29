import { Router } from "express";
import {
  createBlog,
  getBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

// Public
router.get("/", getBlogs);

router.get("/:slug", getBlogBySlug);

// Admin only
router.post("/", verifyToken, createBlog);

router.put("/:id", verifyToken, updateBlog);
router.delete("/:id", verifyToken, deleteBlog);

export default router;

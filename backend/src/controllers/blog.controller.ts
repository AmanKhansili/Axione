import { Request, Response } from "express";
import prisma from "../config/prisma.js";

// Create Blog
export const createBlog = async (req: Request, res: Response) => {
  try {
    const { slug, title, shortDescription, category, date, image, author, content, published } =
      req.body;

    if (!slug || !title || !shortDescription || !category || !date || !author || !content) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    const existingBlog = await prisma.blog.findUnique({
      where: {
        slug,
      },
    });

    if (existingBlog) {
      return res.status(400).json({
        message: "Blog with this slug already exists",
      });
    }

    const blog = await prisma.blog.create({
      data: {
        slug,
        title,
        shortDescription,
        category,
        date,
        image,
        author,
        content,
        published: published ?? false,
      },
    });

    return res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error("Create Blog Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get All Blogs
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(blogs);
  } catch (error) {
    console.error("Get blogs error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get Blog By Slug
export const getBlogBySlug = async (req: Request<{ slug: string }>, res: Response) => {
  try {
    const { slug } = req.params;

    const blog = await prisma.blog.findUnique({
      where: {
        slug,
      },
    });

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    return res.status(200).json(blog);
  } catch (error) {
    console.error("Get blog error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Update Blog
export const updateBlog = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const { title, slug, description, content, image, published } = req.body;

    const blog = await prisma.blog.update({
      where: {
        id,
      },
      data: {
        title,
        slug,
        description,
        content,
        image,
        published,
      },
    });

    return res.status(200).json({
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error("Update blog error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Delete blog
export const deleteBlog = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await prisma.blog.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Blog deleted successfully",
      blog,
    });
  } catch (error) {
    console.error("Delete Blog Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

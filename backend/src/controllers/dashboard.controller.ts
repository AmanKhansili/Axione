import { Request, Response } from "express";
import prisma from "../config/prisma.js";

// Dashboard Stats
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [blogs, services, contacts, newsletter] = await Promise.all([
      prisma.blog.count(),
      prisma.service.count(),
      prisma.contact.count(),
      prisma.newsletter.count(),
    ]);

    return res.status(200).json({
      blogs,
      services,
      contacts,
      newsletter,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

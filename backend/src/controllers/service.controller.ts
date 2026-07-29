import { Request, Response } from "express";
import prisma from "../config/prisma.js";

// Create Service
export const createService = async (req: Request, res: Response) => {
  try {
    const { title, slug, description, icon } = req.body;

    if (!title || !slug || !description) {
      return res.status(400).json({
        message: "Title, slug and description are required",
      });
    }

    const service = await prisma.service.create({
      data: {
        title,
        slug,
        description,
        icon,
      },
    });

    return res.status(201).json({
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Create service error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get All Services
export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(services);
  } catch (error) {
    console.error("Get services error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get Service By Slug
export const getServiceBySlug = async (req: Request<{ slug: string }>, res: Response) => {
  try {
    const { slug } = req.params;

    const service = await prisma.service.findUnique({
      where: { slug },
    });

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    return res.status(200).json(service);
  } catch (error) {
    console.error("Get service error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Update Service
export const updateService = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const { title, slug, description, icon } = req.body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        icon,
      },
    });

    return res.status(200).json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("Update service error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Delete Service
export const deleteService = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.service.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Delete service error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

import { Request, Response } from "express";
import prisma from "../config/prisma.js";

// Create Service
export const createService = async (req: Request, res: Response) => {
  try {
    const {
      slug,
      title,
      icon,
      shortDescription,
      overview,
      features,
      technologies,
      benefits,
      isActive,
    } = req.body;

    if (
      !slug ||
      !title ||
      !icon ||
      !shortDescription ||
      !overview ||
      !features ||
      !technologies ||
      !benefits
    ) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    const existingService = await prisma.service.findUnique({
      where: {
        slug,
      },
    });

    if (existingService) {
      return res.status(400).json({
        message: "Service with this slug already exists",
      });
    }

    const service = await prisma.service.create({
      data: {
        slug,
        title,
        icon,
        shortDescription,
        overview,
        features,
        technologies,
        benefits,
        isActive: isActive ?? true,
      },
    });

    return res.status(201).json({
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Create Service Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get All Services
export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json(services);
  } catch (error) {
    console.error("Get Services Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get Service By Id (Admin)
export const getServiceById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    return res.status(200).json(service);
  } catch (error) {
    console.error("Get Service By Id Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get Service By Slug
export const getServiceBySlug = async (req: Request<{ slug: string }>, res: Response) => {
  try {
    const slug = req.params.slug;

    if (!slug) {
      return res.status(400).json({
        message: "Service slug is required",
      });
    }

    const service = await prisma.service.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!service || !service.isActive) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    return res.status(200).json(service);
  } catch (error) {
    console.error("Get Service Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Update Service
export const updateService = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const {
      slug,
      title,
      icon,
      shortDescription,
      overview,
      features,
      technologies,
      benefits,
      isActive,
    } = req.body;

    const existingService = await prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!existingService) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    const duplicateSlug = await prisma.service.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
    });

    if (duplicateSlug) {
      return res.status(400).json({
        message: "Service with this slug already exists",
      });
    }

    const service = await prisma.service.update({
      where: {
        id,
      },
      data: {
        slug,
        title,
        icon,
        shortDescription,
        overview,
        features,
        technologies,
        benefits,
        isActive,
      },
    });

    return res.status(200).json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("Update Service Error:", error);

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

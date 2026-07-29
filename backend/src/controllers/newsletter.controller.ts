import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const subscribe = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const existingEmail = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already subscribed",
      });
    }

    const subscriber = await prisma.newsletter.create({
      data: { email },
    });

    return res.status(201).json({
      message: "Subscribed successfully",
      subscriber,
    });
  } catch (error) {
    console.error("Newsletter error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getSubscribers = async (req: Request, res: Response) => {
  try {
    const subscribers = await prisma.newsletter.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(subscribers);
  } catch (error) {
    console.error("Get subscribers error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteSubscriber = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.newsletter.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Subscriber deleted successfully",
    });
  } catch (error) {
    console.error("Delete subscriber error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

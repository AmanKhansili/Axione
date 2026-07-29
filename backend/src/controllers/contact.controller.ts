import { Request, Response } from "express";
import prisma from "../config/prisma.js";

// Create Contact - Public
export const createContact = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email and message are required",
      });
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    });

    return res.status(201).json({
      message: "Message sent successfully",
      contact,
    });
  } catch (error) {
    console.error("Create contact error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get All Contacts - Admin
export const getContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(contacts);
  } catch (error) {
    console.error("Get contacts error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Delete Contact - Admin
export const deleteContact = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.contact.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Delete contact error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

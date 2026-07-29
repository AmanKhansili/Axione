import bcrypt from "bcryptjs";
import prisma from "./config/prisma.js";

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: {
        email: "admin@axionesolution.com",
      },
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        name: "Admin",
        email: "admin@axionesolution.com",
        password: hashedPassword,
        isActive: true,
      },
    });

    console.log("Admin created successfully:", admin.email);
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

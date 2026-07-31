import bcrypt from "bcryptjs";
import prisma from "./config/prisma.js";

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: {
        email: "khansiliaman@gmail.com",
      },
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash("Axione@2026@", 10);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        name: "aman",
        email: "khansiliaman@gmail.com",
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

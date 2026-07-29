dotenv.config();
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import newsletterRoutes from "./routes/newsletter.routes.js";
import serviceRoutes from "./routes/service.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/newsletter", newsletterRoutes);
app.use("/api/services", serviceRoutes);

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Axione Backend Running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

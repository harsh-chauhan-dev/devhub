import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { initDB } from "./config/db.js";
import { initCronJobs } from "./services/cronService.js";

import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database
await initDB();

// Initialize Cron Jobs
initCronJobs();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.set("trust proxy", true);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/schedules", scheduleRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "DevHub Backend",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: "API Route Not Found",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
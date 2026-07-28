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

// Initialize PostgreSQL Database Connections & Tables
initDB();

// Initialize Background Cron Jobs
initCronJobs();

// Middleware
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost")) {
        callback(null, true);
      } else {
        callback(null, origin);
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/schedules", scheduleRoutes);

// Root Health Check Route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "DevHub Node.js + Express + PostgreSQL Backend Server",
    routes: ["/api/auth", "/api/todos", "/api/notes", "/api/notifications", "/api/analytics", "/api/schedules"],
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "API Route Not Found" });
});

app.listen(PORT, () => {
  console.log(`🚀 DevHub Server running on http://localhost:${PORT}`);
});

import express from "express";
import {
  getNotifications,
  markAsRead,
  triggerScheduleCheck,
  triggerTestEmail,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markAsRead);
router.post("/schedule-check", protect, triggerScheduleCheck);
router.post("/test-email", protect, triggerTestEmail);

export default router;

import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  triggerScheduleCheck,
  triggerTestEmail,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.delete("/", protect, clearAllNotifications);
router.put("/read-all", protect, markAllAsRead);
router.put("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteNotification);
router.post("/schedule-check", protect, triggerScheduleCheck);
router.post("/test-email", protect, triggerTestEmail);

export default router;

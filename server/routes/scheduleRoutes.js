import express from "express";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../controllers/scheduleController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getSchedules);
router.post("/", protect, createSchedule);
router.put("/:id", protect, updateSchedule);
router.delete("/:id", protect, deleteSchedule);

export default router;
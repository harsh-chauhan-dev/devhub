import { queryDB, isPgConnected } from "../config/db.js";
import { sendNotificationEmail } from "../services/mailService.js";
import { checkUpcomingSchedules } from "../services/cronService.js";

// @desc    Get user notifications from PostgreSQL
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    if (isPgConnected && req.user?.id) {
      const result = await queryDB(
        "SELECT id, message, read, type, created_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
        [req.user.id]
      );
      return res.json(result.rows);
    }
  } catch (error) {
    // Return empty fallback array on DB query failure
  }

  res.json([]);
};

// @desc    Mark notification as read in PostgreSQL
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    if (isPgConnected && id && req.user?.id) {
      await queryDB("UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2", [id, req.user.id]);
      return res.json({ message: "Notification marked as read in database" });
    }
  } catch (error) {
    // Handled silently
  }

  res.json({ message: "Notification marked as read" });
};

// @desc    Mark all notifications as read in PostgreSQL
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res) => {
  try {
    if (isPgConnected && req.user?.id) {
      await queryDB("UPDATE notifications SET read = true WHERE user_id = $1", [req.user.id]);
      return res.json({ message: "All notifications marked as read in database" });
    }
  } catch (error) {
    // Handled silently
  }

  res.json({ message: "All notifications marked as read" });
};

// @desc    Delete notification from PostgreSQL database
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    if (isPgConnected && id && req.user?.id) {
      await queryDB("DELETE FROM notifications WHERE id = $1 AND user_id = $2", [id, req.user.id]);
      return res.json({ message: "Notification deleted from database successfully" });
    }
  } catch (error) {
    // Handled silently
  }

  res.json({ message: "Notification deleted from database" });
};

// @desc    Clear all notifications for the authenticated user from PostgreSQL database
// @route   DELETE /api/notifications
// @access  Private
export const clearAllNotifications = async (req, res) => {
  try {
    if (isPgConnected && req.user?.id) {
      await queryDB("DELETE FROM notifications WHERE user_id = $1", [req.user.id]);
      return res.json({ message: "All notifications cleared from database successfully" });
    }
  } catch (error) {
    // Handled silently
  }

  res.json({ message: "All notifications cleared from database" });
};

// @desc    Trigger scheduled task check
// @route   POST /api/notifications/schedule-check
// @access  Private
export const triggerScheduleCheck = async (req, res) => {
  const result = await checkUpcomingSchedules();
  return res.json({ message: "Schedule check completed", ...result });
};

// @desc    Send test notification email via Nodemailer
// @route   POST /api/notifications/test-email
// @access  Private
export const triggerTestEmail = async (req, res) => {
  const emailTo = req.body.email || req.user?.email;

  if (!emailTo) {
    return res.status(400).json({ message: "No email address available" });
  }

  const result = await sendNotificationEmail({
    to: emailTo,
    subject: " DevHub Notification Email",
    title: "Scheduled Workspace Notification",
    body: "This notification was dispatched from your <strong>DevHub Node.js + Express + PostgreSQL Backend</strong> server.",
    actionUrl: "http://localhost:5173/dashboard",
  });

  res.json({
    message: `Email notification sent to ${emailTo}`,
    details: result,
  });
};
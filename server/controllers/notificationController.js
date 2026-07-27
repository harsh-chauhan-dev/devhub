import { queryDB, isPgConnected } from "../config/db.js";
import { sendNotificationEmail } from "../services/mailService.js";

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
    console.error("PG getNotifications Error:", error.message);
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
      return res.json({ message: "Notification marked as read" });
    }
  } catch (error) {
    console.error("PG markAsRead Error:", error.message);
  }

  res.json({ message: "Notification marked as read" });
};

// @desc    Trigger scheduled task check: send in-app notification and email to user
// @route   POST /api/notifications/schedule-check
// @access  Private
export const triggerScheduleCheck = async (req, res) => {
  const userId = req.user?.id;
  const userEmail = req.user?.email;
  const userName = req.user?.name || "Developer";

  try {
    if (isPgConnected && userId) {
      // Fetch pending tasks for the user from PostgreSQL
      const pendingRes = await queryDB(
        "SELECT id, text, priority, category FROM todos WHERE user_id = $1 AND completed = false ORDER BY created_at DESC",
        [userId]
      );

      const pendingTasks = pendingRes.rows;
      const count = pendingTasks.length;

      let msg = "";
      if (count > 0) {
        msg = `⏰ Schedule Reminder: You have ${count} pending sprint task${count > 1 ? "s" : ""} ("${pendingTasks[0].text.slice(0, 30)}...")`;
      } else {
        msg = `🎉 Great job ${userName}! All sprint tasks are completed.`;
      }

      // 1. Save In-App Notification in PostgreSQL DB
      await queryDB(
        "INSERT INTO notifications (user_id, message, type) VALUES ($1, $2, $3)",
        [userId, msg, "reminder"]
      );

      // 2. Dispatch Email Notification via Nodemailer
      if (userEmail) {
        const taskItemsHtml = pendingTasks.length > 0
          ? `<ul>${pendingTasks.map(t => `<li><strong>[${t.priority}]</strong> ${t.text} (<em>${t.category}</em>)</li>`).join('')}</ul>`
          : `<p>No pending tasks! Your backlog is clear.</p>`;

        await sendNotificationEmail({
          to: userEmail,
          subject: `⏰ Scheduled Task Reminder — ${count} Pending Items`,
          title: `Upcoming Task Schedule Notification`,
          body: `Hi <strong>${userName}</strong>,<br><br>Here is your current pending sprint schedule update:<br>${taskItemsHtml}`,
          actionUrl: "http://localhost:5173/todo",
        });
      }

      return res.json({
        message: "Schedule notification sent successfully to in-app bell & email inbox",
        pendingCount: count,
        userEmail,
      });
    }
  } catch (error) {
    console.error("PG triggerScheduleCheck Error:", error.message);
    return res.status(500).json({ message: "Failed to process schedule notification" });
  }

  res.status(500).json({ message: "Database connection unavailable" });
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
    subject: "⚡ DevHub Notification Email",
    title: "Scheduled Workspace Notification",
    body: "This notification was dispatched from your <strong>DevHub Node.js + Express + PostgreSQL Backend</strong> server.",
    actionUrl: "http://localhost:5173/dashboard",
  });

  // Also log notification in DB
  try {
    if (isPgConnected && req.user?.id) {
      await queryDB(
        "INSERT INTO notifications (user_id, message, type) VALUES ($1, $2, $3)",
        [req.user.id, `Email notification sent to ${emailTo}`, "email"]
      );
    }
  } catch (err) {
    console.error("Save test notification error:", err.message);
  }

  res.json({
    message: `Email notification sent to ${emailTo}`,
    details: result,
  });
};

import cron from "node-cron";
import { queryDB, isPgConnected } from "../config/db.js";
import { sendScheduleReminderEmail } from "./mailService.js";

/**
 * Checks for due/upcoming schedules within the notification window,
 * dispatches in-app bell notifications and emails, and updates schedule status to 'Notified'.
 */
export const checkUpcomingSchedules = async () => {
  if (!isPgConnected) {
    return { processed: 0, message: "PostgreSQL Database Connection Offline" };
  }

  try {
    const scheduleRes = await queryDB(`
      SELECT s.id, s.title, s.description, s.scheduled_date, s.notify_email, u.id as user_id, u.name, u.email
      FROM schedules s
      JOIN users u ON s.user_id = u.id
      WHERE s.status IN ('Scheduled', 'Pending')
        AND s.scheduled_date <= NOW() + INTERVAL '1 hour'
    `);

    const processedList = [];

    for (const sRow of scheduleRes.rows) {
      const dateFormatted = new Date(sRow.scheduled_date).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // 1. Send In-App Bell Notification
      await queryDB(
        `INSERT INTO notifications (user_id, title, message, description, type)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          sRow.user_id,
          "⏰ Upcoming Schedule Reminder",
          `Reminder: "${sRow.title}" is due!`,
          `Scheduled for ${dateFormatted}${sRow.description ? " — " + sRow.description : ""}`,
          "reminder",
        ]
      ).catch((err) => console.error("Cron notification insert error:", err));

      // 2. Dispatch Email Reminder via Nodemailer
      if (sRow.notify_email !== false && sRow.email) {
        const clientBaseUrl = process.env.CLIENT_URL || "http://localhost:5173";
        await sendScheduleReminderEmail({
          to: sRow.email,
          name: sRow.name,
          title: sRow.title,
          scheduledDate: dateFormatted,
          description: sRow.description || "",
          actionUrl: `${clientBaseUrl}/schedules`,
        }).catch((err) => console.error("Cron reminder email send error:", err));
      }

      // 3. Mark schedule status as 'Notified' so notifications are dispatched only once
      await queryDB(
        `UPDATE schedules SET status = 'Notified' WHERE id = $1`,
        [sRow.id]
      ).catch((err) => console.error("Cron update schedule status error:", err));

      processedList.push({ id: sRow.id, title: sRow.title });
    }

    return { processed: processedList.length, schedules: processedList };
  } catch (err) {
    console.error("Error in checkUpcomingSchedules cron job:", err);
    return { processed: 0, error: err.message };
  }
};

export const initCronJobs = () => {
  // Run cron check every 1 minute in background
  cron.schedule("*/1 * * * *", async () => {
    try {
      await checkUpcomingSchedules();
    } catch (err) {
      console.error("Cron execution error:", err.message);
    }
  });
};
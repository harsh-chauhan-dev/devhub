import cron from "node-cron";
import { queryDB, isPgConnected } from "../config/db.js";
import { sendScheduleReminderEmail } from "./mailService.js";

export const initCronJobs = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      if (isPgConnected) {
        const scheduleRes = await queryDB(`
          SELECT s.id, s.title, s.description, s.scheduled_date, s.notify_email, u.id as user_id, u.name, u.email
          FROM schedules s
          JOIN users u ON s.user_id = u.id
          WHERE s.status = 'Scheduled' AND s.scheduled_date <= NOW() + INTERVAL '1 hour'
        `);

        for (const sRow of scheduleRes.rows) {
          const dateFormatted = new Date(sRow.scheduled_date).toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          // 1. Send In-App Site Notification
          await queryDB(
            `INSERT INTO notifications (user_id, message, type) VALUES ($1, $2, $3)`,
            [sRow.user_id, `⏰ Upcoming Schedule Alert: "${sRow.title}" set for ${dateFormatted}!`, "reminder"]
          ).catch(() => {});

          if (sRow.notify_email !== false && sRow.email) {
            await sendScheduleReminderEmail({
              to: sRow.email,
              name: sRow.name,
              title: sRow.title,
              scheduledDate: dateFormatted,
              description: sRow.description,
              actionUrl: "http://localhost:5173/schedules",
            }).catch(() => {});
          }

          // 3. Mark schedule status as 'Notified' so notifications are dispatched only once
          await queryDB(
            `UPDATE schedules SET status = 'Notified' WHERE id = $1`,
            [sRow.id]
          ).catch(() => {});
        }
      }
    } catch (err) {
     
    }
  });

 
};

import cron from "node-cron";
import { queryDB, isPgConnected } from "../config/db.js";
import { sendNotificationEmail } from "./mailService.js";

export const initCronJobs = () => {
  console.log("⏰ Initializing node-cron background scheduled tasks...");

  // Schedule background task runner to check pending sprint tasks & upcoming schedules every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    console.log("🔍 [Cron Job] Running automated schedule check and email dispatcher...");

    try {
      if (isPgConnected) {
        // 1. Query users with pending todos
        const todoResult = await queryDB(`
          SELECT u.id, u.name, u.email, COUNT(t.id) as pending_count
          FROM users u
          JOIN todos t ON u.id = t.user_id
          WHERE t.completed = false
          GROUP BY u.id, u.name, u.email
        `);

        for (const userRow of todoResult.rows) {
          if (userRow.pending_count > 0) {
            console.log(`📩 Dispatching automated scheduled task email to ${userRow.email}...`);

            await queryDB(
              `INSERT INTO notifications (user_id, message, type) VALUES ($1, $2, $3)`,
              [
                userRow.id,
                `⏰ Automated Schedule Reminder: You have ${userRow.pending_count} pending sprint task${userRow.pending_count > 1 ? "s" : ""} waiting in your backlog!`,
                "reminder",
              ]
            ).catch(() => {});

            await sendNotificationEmail({
              to: userRow.email,
              subject: `⏰ Scheduled Sprint Reminder — ${userRow.pending_count} Pending Tasks`,
              title: `Hi ${userRow.name}, your sprint schedule update is ready!`,
              body: `Don't forget your scheduled sprint goals. You currently have <strong>${userRow.pending_count} pending task${userRow.pending_count > 1 ? "s" : ""}</strong> waiting in your DevHub workspace dashboard.`,
              actionUrl: "http://localhost:5173/todo",
            }).catch((err) => console.warn("Cron email dispatch warning:", err.message));
          }
        }

        // 2. Query upcoming PostgreSQL schedules due soon
        const scheduleRes = await queryDB(`
          SELECT s.id, s.title, s.scheduled_date, u.id as user_id, u.name, u.email
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

          await queryDB(
            `INSERT INTO notifications (user_id, message, type) VALUES ($1, $2, $3)`,
            [sRow.user_id, `⏰ Upcoming Schedule Alert: "${sRow.title}" set for ${dateFormatted}!`, "reminder"]
          ).catch(() => {});

          await sendNotificationEmail({
            to: sRow.email,
            subject: `⏰ Upcoming Schedule Event: ${sRow.title}`,
            title: `Scheduled Event Reminder`,
            body: `Hi <strong>${sRow.name}</strong>,<br><br>Your scheduled event <strong>"${sRow.title}"</strong> is coming up on <strong>${dateFormatted}</strong>.`,
            actionUrl: "http://localhost:5173/schedules",
          }).catch((err) => console.warn("Schedule cron email error:", err.message));
        }
      }
    } catch (err) {
      console.error("❌ [Cron Job Error]:", err.message);
    }
  });

  console.log("✅ Node-cron background schedule tasks active (running every 5 mins).");
};

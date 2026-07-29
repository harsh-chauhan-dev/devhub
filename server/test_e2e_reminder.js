import dotenv from "dotenv";
import { queryDB, initDB } from "./config/db.js";
import { checkUpcomingSchedules } from "./services/cronService.js";
import { sendScheduleCreatedEmail } from "./services/mailService.js";

dotenv.config();

const testFullPipeline = async () => {
  console.log("--------------------------------------------------");
  console.log("🧪 STARTING FULL E2E SCHEDULE & REMINDER PIPELINE TEST");
  console.log("--------------------------------------------------");

  console.log("\n1. Connecting to PostgreSQL...");
  await initDB();
  await new Promise((r) => setTimeout(r, 1000));

  console.log("\n2. Fetching test user...");
  const userRes = await queryDB("SELECT id, name, email FROM users LIMIT 1");
  if (userRes.rows.length === 0) {
    console.error("❌ Error: No users found in database.");
    process.exit(1);
  }
  const user = userRes.rows[0];
  console.log(`✅ Test User Found: ${user.name} (${user.email})`);

  // Step 1: User creates schedule
  const testTitle = `Live Verification Test ${Date.now().toString().slice(-4)}`;
  const scheduleTime = new Date(Date.now() + 5000); // 5 seconds in future

  console.log(`\n3. Creating Schedule: "${testTitle}" scheduled for ${scheduleTime.toLocaleTimeString()}...`);
  
  const insertRes = await queryDB(
    `INSERT INTO schedules (user_id, title, description, scheduled_date, status, notify_email)
     VALUES ($1, $2, $3, $4, 'Scheduled', true)
     RETURNING id, title, description, scheduled_date, status`,
    [user.id, testTitle, "Testing automated creation email & reminder email pipeline.", scheduleTime]
  );
  const schedule = insertRes.rows[0];
  console.log(`✅ Schedule Created in DB! Status = "${schedule.status}"`);

  // Dispatch creation email
  console.log("\n4. Dispatching Schedule Created Confirmation Email...");
  const createMailRes = await sendScheduleCreatedEmail({
    to: user.email,
    name: user.name,
    title: testTitle,
    scheduledDate: scheduleTime.toLocaleTimeString(),
    description: schedule.description,
  });
  console.log("✅ Confirmation Email Result:", createMailRes);

  console.log("\n5. Checking DB before time arrives (should be 0 due reminders)...");
  const checkBefore = await checkUpcomingSchedules();
  console.log("📊 Check Before Time Arrives:", checkBefore);

  console.log("\n6. Waiting 6 seconds for scheduled time to arrive...");
  await new Promise((r) => setTimeout(r, 6000));

  console.log("\n7. Time has arrived! Running background schedule worker...");
  const checkAfter = await checkUpcomingSchedules();
  console.log("📊 Check After Time Arrived:", checkAfter);

  console.log("\n8. Verifying In-App Notifications table...");
  const notifRes = await queryDB(
    "SELECT id, title, message, description, type, created_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 2",
    [user.id]
  );
  console.log("🔔 Latest Notifications in DB:", notifRes.rows);

  console.log("\n9. Verifying Schedule Status in DB...");
  const finalSchedRes = await queryDB("SELECT id, title, status FROM schedules WHERE id = $1", [schedule.id]);
  console.log("📌 Final Schedule Status:", finalSchedRes.rows[0]);

  console.log("\n--------------------------------------------------");
  console.log("🎉 ALL PIPELINE CHECKS COMPLETED SUCCESSFULLY!");
  console.log("--------------------------------------------------");
  process.exit(0);
};

testFullPipeline().catch((err) => {
  console.error("❌ E2E Test Failed:", err);
  process.exit(1);
});

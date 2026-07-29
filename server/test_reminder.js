import dotenv from "dotenv";
import { queryDB, initDB } from "./config/db.js";
import { checkUpcomingSchedules } from "./services/cronService.js";

dotenv.config();

const runTest = async () => {
  console.log("🔍 Initializing DB Connection...");
  await initDB();
  
  // Wait 1 second for pool connection
  await new Promise((r) => setTimeout(r, 1000));

  console.log("👤 Querying first available user...");
  const userRes = await queryDB("SELECT id, name, email FROM users LIMIT 1");
  
  if (userRes.rows.length === 0) {
    console.log("❌ No user found in database to test with.");
    process.exit(1);
  }

  const user = userRes.rows[0];
  console.log(`✅ Using User: ${user.name} (${user.email}) [ID: ${user.id}]`);

  // Create a test schedule scheduled 15 minutes from now
  const testTitle = `Test Sprint Release Review ${Date.now().toString().slice(-4)}`;
  const scheduledTime = new Date(Date.now() + 15 * 60 * 1000); // 15 mins from now

  console.log(`📅 Inserting test schedule: "${testTitle}" for ${scheduledTime.toISOString()}...`);
  const schedRes = await queryDB(
    `INSERT INTO schedules (user_id, title, description, scheduled_date, status, notify_email)
     VALUES ($1, $2, $3, $4, 'Scheduled', true)
     RETURNING id, title, description, scheduled_date, status`,
    [user.id, testTitle, "Testing automated reminder email & live website notification bell system.", scheduledTime]
  );

  const sched = schedRes.rows[0];
  console.log(`✅ Test Schedule Created! ID: ${sched.id}`);

  console.log("\n🚀 Triggering checkUpcomingSchedules()...");
  const result = await checkUpcomingSchedules();
  console.log("📊 Cron Result:", result);

  console.log("\n🔔 Checking notifications table for user...");
  const notifRes = await queryDB(
    "SELECT id, title, message, description, type, created_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 3",
    [user.id]
  );
  console.log("📋 Latest Notifications in DB:", notifRes.rows);

  console.log("\n✨ Schedule Status after test:");
  const statusRes = await queryDB("SELECT id, title, status FROM schedules WHERE id = $1", [sched.id]);
  console.log("📌 Updated Schedule Row:", statusRes.rows[0]);

  process.exit(0);
};

runTest().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});

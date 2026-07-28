import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool, Client } = pg;

const user = process.env.PGUSER || "postgres";
const password = process.env.PGPASSWORD || "Harsh123@";
const host = process.env.PGHOST || "localhost";
const port = process.env.PGPORT || 5432;
const dbName = process.env.PGDATABASE || "devhub";

const encodedPassword = encodeURIComponent(password);
const defaultDbUrl = `postgresql://${user}:${encodedPassword}@${host}:${port}/postgres`;
const targetDbUrl = process.env.DATABASE_URL || `postgresql://${user}:${encodedPassword}@${host}:${port}/${dbName}`;

export let pool = new Pool({
  connectionString: targetDbUrl,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export let isPgConnected = false;

// Helper to ensure target database exists
const ensureDatabaseExists = async () => {
  const adminClient = new Client({ connectionString: defaultDbUrl });
  try {
    await adminClient.connect();
    const res = await adminClient.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
    if (res.rowCount === 0) {
      // console.log(`📦 Creating PostgreSQL database "${dbName}"...`);
      await adminClient.query(`CREATE DATABASE "${dbName}"`);
      // console.log(`✅ PostgreSQL database "${dbName}" created successfully!`);
    }
  } catch (err) {
    // console.warn("⚠️ Database existence check warning:", err.message);
  } finally {
    await adminClient.end().catch(() => {});
  }
};

export const initDB = async () => {
  try {
    // 1. Ensure database exists
    await ensureDatabaseExists();

    // 2. Connect pool
    const client = await pool.connect();
    // console.log(`✅ PostgreSQL Database "${dbName}" Connected Successfully!`);
    isPgConnected = true;

    // 3. Auto-initialize tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(100) DEFAULT 'Full Stack Developer',
        bio TEXT DEFAULT 'Passionate developer building scalable web applications.',
        location VARCHAR(100) DEFAULT 'Meerut, India',
        github_username VARCHAR(100) DEFAULT 'harsh-chauhan-dev',
        avatar TEXT DEFAULT 'https://avatars.githubusercontent.com/u/199341266?v=4',
        skills TEXT[] DEFAULT ARRAY['React', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS', 'MongoDB'],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE users ADD COLUMN IF NOT EXISTS github_username VARCHAR(100) DEFAULT 'harsh-chauhan-dev';

      CREATE TABLE IF NOT EXISTS todos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        text TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        priority VARCHAR(50) DEFAULT 'Medium',
        category VARCHAR(50) DEFAULT 'General',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        tag VARCHAR(50) DEFAULT 'General',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        type VARCHAR(50) DEFAULT 'system',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS schedules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
        status VARCHAR(50) DEFAULT 'Scheduled',
        notify_email BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    client.release();
    // console.log("✅ PostgreSQL Database Tables Initialized (users, todos, notes, notifications, schedules)");
  } catch (error) {
    // console.warn("⚠️ PostgreSQL Connection Error:", error.message);
    isPgConnected = false;
  }
};

export const queryDB = async (text, params) => {
  return pool.query(text, params);
};

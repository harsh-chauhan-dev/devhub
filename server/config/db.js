import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

let targetDbUrl = process.env.DATABASE_URL;
if (targetDbUrl && targetDbUrl.includes("sslmode=require")) {
  targetDbUrl = targetDbUrl.replace("sslmode=require", "sslmode=verify-full");
}

export const pool = new Pool({
  connectionString: targetDbUrl,
  ssl:
    process.env.NODE_ENV === "production" || (targetDbUrl && targetDbUrl.includes("neon.tech"))
      ? { rejectUnauthorized: false }
      : false,
});

export let isPgConnected = false;

export const initDB = async () => {
  try {
    const client = await pool.connect();

    isPgConnected = true;
    console.log("✅ PostgreSQL Connected Successfully!");

    await client.query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
        skills TEXT[] DEFAULT ARRAY[
          'React',
          'Node.js',
          'Express',
          'PostgreSQL',
          'Tailwind CSS',
          'MongoDB'
        ],
        is_verified BOOLEAN DEFAULT FALSE,
        verification_token VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS github_username VARCHAR(100) DEFAULT 'harsh-chauhan-dev';

      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255);

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
        title VARCHAR(255),
        message TEXT NOT NULL,
        description TEXT,
        read BOOLEAN DEFAULT FALSE,
        type VARCHAR(50) DEFAULT 'system',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE notifications
      ADD COLUMN IF NOT EXISTS title VARCHAR(255);

      ALTER TABLE notifications
      ADD COLUMN IF NOT EXISTS description TEXT;

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

      ALTER TABLE schedules
      DROP CONSTRAINT IF EXISTS schedules_status_check;

      CREATE TABLE IF NOT EXISTS email_verifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        verification_token_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    client.release();

    console.log("✅ Database Initialized Successfully!");
  } catch (error) {
    isPgConnected = false;
    console.error("❌ Database Error:", error.message);
  }
};

export const queryDB = async (text, params) => {
  return pool.query(text, params);
};
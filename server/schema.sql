-- =============================================================================
-- DevHub PostgreSQL Complete Production Database Data Model (SQL Schema)
-- Project: DevHub Developer Productivity Portal
-- Database Engine: PostgreSQL 12+
-- =============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop Existing Tables (Uncomment for fresh reset)
-- DROP TABLE IF EXISTS notifications CASCADE;
-- DROP TABLE IF EXISTS notes CASCADE;
-- DROP TABLE IF EXISTS todos CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- =============================================================================
-- TABLE 1: USERS (User Accounts & Profile Data)
-- =============================================================================
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast user authentication & email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =============================================================================
-- TABLE 2: TODOS (Sprint Tasks & Work Items)
-- =============================================================================
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  priority VARCHAR(50) CHECK (priority IN ('High', 'Medium', 'Low')) DEFAULT 'Medium',
  category VARCHAR(50) DEFAULT 'General',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for user-specific todo lookups & priority filtering
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);

-- =============================================================================
-- TABLE 3: NOTES (System Architecture & Sprint Documentation)
-- =============================================================================
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  tag VARCHAR(50) DEFAULT 'General',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for user-specific note lookups & tag search
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_tag ON notes(tag);

-- =============================================================================
-- TABLE 4: NOTIFICATIONS (System Alerts & Email Reminders Log)
-- =============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  type VARCHAR(50) DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for unread user notification queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);

-- =============================================================================
-- AUTOMATIC TIMESTAMP TRIGGER FUNCTION
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Attach Triggers for auto updated_at maintenance
DROP TRIGGER IF EXISTS update_users_modtime ON users;
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_todos_modtime ON todos;
CREATE TRIGGER update_todos_modtime BEFORE UPDATE ON todos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notes_modtime ON notes;
CREATE TRIGGER update_notes_modtime BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- INITIAL DEMO SEED DATA
-- =============================================================================
INSERT INTO users (id, name, email, password, role, bio, location, github_username, avatar, skills)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Harsh Chauhan',
  'harsh@devhub.com',
  '$2a$10$e8w.HashedPasswordSampleStringHereKey123',
  'Full Stack Developer',
  'Passionate developer building scalable web applications with React, Node.js, Express, and PostgreSQL.',
  'Meerut, India',
  'harsh-chauhan-dev',
  'https://avatars.githubusercontent.com/u/199341266?v=4',
  ARRAY['React', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS', 'MongoDB']
) ON CONFLICT (email) DO NOTHING;

INSERT INTO todos (id, user_id, text, completed, priority, category)
VALUES 
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Build DevHub Node+Express REST Authentication API', true, 'High', 'Backend'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Integrate GitHub & Weather Services', true, 'High', 'Frontend'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Design responsive dark mode dashboard', false, 'Medium', 'UI/UX'),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Setup PostgreSQL database schema in Express server', false, 'High', 'Database'),
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Write unit tests for REST API endpoints', false, 'Low', 'Testing')
ON CONFLICT DO NOTHING;

INSERT INTO notes (id, user_id, title, content, tag)
VALUES 
  ('11eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'System Architecture Notes', 'Implement RESTful APIs with Node.js, Express, PostgreSQL, and JWT Authentication for secure user data isolation.', 'Architecture'),
  ('22eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'React 19 Hooks Best Practices', 'Use standard useActionState and useOptimistic for smoother UI updates without boilerplate loading states.', 'Frontend'),
  ('33eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'DevHub Sprint Goals', 'Complete client service REST integration, Node.js + Express + PostgreSQL backend release, and deployment.', 'Sprint')
ON CONFLICT DO NOTHING;

INSERT INTO notifications (id, user_id, message, read, type)
VALUES 
  ('44eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Welcome to DevHub! Express & PostgreSQL Backend active.', false, 'system'),
  ('55eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'GitHub profile harsh-chauhan-dev synced successfully.', true, 'github')
ON CONFLICT DO NOTHING;

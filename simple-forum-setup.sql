-- Simple forum setup - only posts and comments tables
-- Run this in your Supabase SQL Editor

-- 1. Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 2. Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 3. Disable RLS for now (we'll enable it later)
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;

-- 4. Create a test post
INSERT INTO posts (content, user_id) 
VALUES ('Welcome to the Pomodoro PWA Forum! 🍅', '41ea0fa6-0b68-4b31-a9a7-4f368e721570')
ON CONFLICT DO NOTHING;

-- 5. Test the setup
SELECT 'Forum setup complete!' as status;
SELECT COUNT(*) as post_count FROM posts;

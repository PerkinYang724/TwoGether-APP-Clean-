-- Drop existing policies first, then recreate them
DROP POLICY IF EXISTS "own profile" ON profiles;
DROP POLICY IF EXISTS "own sessions" ON sessions;
DROP POLICY IF EXISTS "own posts" ON posts;
DROP POLICY IF EXISTS "own comments" ON comments;
DROP POLICY IF EXISTS "read posts" ON posts;
DROP POLICY IF EXISTS "read comments" ON comments;

-- Recreate the policies
CREATE POLICY "own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "own sessions" ON sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own posts" ON posts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own comments" ON comments FOR ALL USING (auth.uid() = user_id);

-- Allow all users to read posts and comments
CREATE POLICY "read posts" ON posts FOR SELECT USING (true);
CREATE POLICY "read comments" ON comments FOR SELECT USING (true);

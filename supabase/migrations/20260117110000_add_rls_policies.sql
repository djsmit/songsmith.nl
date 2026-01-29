-- Enable Row Level Security on all user data tables
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE setlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE setlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Songs: Users can only access their own songs
DROP POLICY IF EXISTS "Users can view own songs" ON songs;
CREATE POLICY "Users can view own songs" ON songs
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own songs" ON songs;
CREATE POLICY "Users can insert own songs" ON songs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own songs" ON songs;
CREATE POLICY "Users can update own songs" ON songs
  FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own songs" ON songs;
CREATE POLICY "Users can delete own songs" ON songs
  FOR DELETE USING (auth.uid() = user_id);

-- Setlists: Users can only access their own setlists
DROP POLICY IF EXISTS "Users can view own setlists" ON setlists;
CREATE POLICY "Users can view own setlists" ON setlists
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own setlists" ON setlists;
CREATE POLICY "Users can insert own setlists" ON setlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own setlists" ON setlists;
CREATE POLICY "Users can update own setlists" ON setlists
  FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own setlists" ON setlists;
CREATE POLICY "Users can delete own setlists" ON setlists
  FOR DELETE USING (auth.uid() = user_id);

-- Setlist_songs: Access controlled via setlist ownership
DROP POLICY IF EXISTS "Users can view setlist_songs via setlist" ON setlist_songs;
CREATE POLICY "Users can view setlist_songs via setlist" ON setlist_songs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM setlists WHERE id = setlist_id AND user_id = auth.uid())
  );
DROP POLICY IF EXISTS "Users can insert setlist_songs via setlist" ON setlist_songs;
CREATE POLICY "Users can insert setlist_songs via setlist" ON setlist_songs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM setlists WHERE id = setlist_id AND user_id = auth.uid())
  );
DROP POLICY IF EXISTS "Users can update setlist_songs via setlist" ON setlist_songs;
CREATE POLICY "Users can update setlist_songs via setlist" ON setlist_songs
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM setlists WHERE id = setlist_id AND user_id = auth.uid())
  );
DROP POLICY IF EXISTS "Users can delete setlist_songs via setlist" ON setlist_songs;
CREATE POLICY "Users can delete setlist_songs via setlist" ON setlist_songs
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM setlists WHERE id = setlist_id AND user_id = auth.uid())
  );

-- Profiles: Users can only access their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
-- Note: Profile insertion is typically handled by auth triggers, so no INSERT policy needed

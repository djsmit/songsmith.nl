-- Add status column for song workflow states (demo, archived)
ALTER TABLE songs ADD COLUMN IF NOT EXISTS status TEXT DEFAULT NULL
  CHECK (status IS NULL OR status IN ('demo', 'archived'));

-- Add is_favorite column for quick-access marking
ALTER TABLE songs ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false;

-- Create indexes for efficient filtering
CREATE INDEX IF NOT EXISTS idx_songs_user_status ON songs(user_id, status);
CREATE INDEX IF NOT EXISTS idx_songs_user_favorite ON songs(user_id, is_favorite);

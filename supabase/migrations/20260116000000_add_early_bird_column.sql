-- Add is_early_bird column to profiles table
-- Run this migration in Supabase SQL Editor

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_early_bird BOOLEAN DEFAULT FALSE;

-- Create an index for efficient counting of early bird users
CREATE INDEX IF NOT EXISTS idx_profiles_is_early_bird ON profiles(is_early_bird) WHERE is_early_bird = TRUE;

-- Comment for documentation
COMMENT ON COLUMN profiles.is_early_bird IS 'Indicates if user claimed the free Pro plan during the early bird launch (first 50 users)';

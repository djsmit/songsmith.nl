-- Drop color_theme column from profiles table
ALTER TABLE profiles
DROP COLUMN IF EXISTS color_theme;

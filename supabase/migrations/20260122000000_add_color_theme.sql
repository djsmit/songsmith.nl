-- Add color_theme column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS color_theme TEXT DEFAULT 'dark-teal';

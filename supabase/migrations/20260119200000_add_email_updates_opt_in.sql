-- Add email_updates_opt_in column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_updates_opt_in BOOLEAN DEFAULT false;

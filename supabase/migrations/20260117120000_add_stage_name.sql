-- Add stage_name and use_stage_name columns to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS stage_name TEXT,
ADD COLUMN IF NOT EXISTS use_stage_name BOOLEAN DEFAULT FALSE;

-- Add written_at date field to songs table
ALTER TABLE songs
ADD COLUMN IF NOT EXISTS written_at DATE;

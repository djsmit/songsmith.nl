-- Add encrypted_title column to songs table
-- This allows storing encrypted song titles while keeping the original title column
-- for backward compatibility during migration
ALTER TABLE songs ADD COLUMN IF NOT EXISTS encrypted_title TEXT;

-- Add comment explaining the column purpose
COMMENT ON COLUMN songs.encrypted_title IS 'AES-256-GCM encrypted song title. When present, title column contains a placeholder.';

-- Add original_artist column for cover songs
-- A song is a cover if original_artist is not null/empty
ALTER TABLE songs ADD COLUMN IF NOT EXISTS original_artist TEXT;
COMMENT ON COLUMN songs.original_artist IS 'Original artist name for cover songs. NULL means original song.';

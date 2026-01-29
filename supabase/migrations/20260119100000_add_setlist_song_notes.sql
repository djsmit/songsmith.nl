-- Add notes column to setlist_songs for per-song notes in setlists
ALTER TABLE setlist_songs ADD COLUMN IF NOT EXISTS notes TEXT;

COMMENT ON COLUMN setlist_songs.notes IS 'Optional notes specific to this song in this setlist (e.g., tuning notes, capo reminder, arrangement notes)';

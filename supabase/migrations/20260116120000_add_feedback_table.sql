-- Create feedback table for collecting user feedback
-- Run this migration in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('feature', 'bug', 'improvement', 'other')),
  message TEXT NOT NULL,
  page_context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_early_bird BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'actioned', 'closed'))
);

-- Create index for efficient queries by user
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);

-- Create index for filtering by status
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);

-- Create index for filtering by early bird
CREATE INDEX IF NOT EXISTS idx_feedback_is_early_bird ON feedback(is_early_bird) WHERE is_early_bird = TRUE;

-- Enable Row Level Security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own feedback
DROP POLICY IF EXISTS "Users can insert own feedback" ON feedback;
CREATE POLICY "Users can insert own feedback"
  ON feedback
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own feedback
DROP POLICY IF EXISTS "Users can view own feedback" ON feedback;
CREATE POLICY "Users can view own feedback"
  ON feedback
  FOR SELECT
  USING (auth.uid() = user_id);

-- Comment for documentation
COMMENT ON TABLE feedback IS 'User feedback collected to help shape Fretlist development';
COMMENT ON COLUMN feedback.category IS 'Type of feedback: feature, bug, improvement, or other';
COMMENT ON COLUMN feedback.page_context IS 'URL/page where the feedback was submitted from';
COMMENT ON COLUMN feedback.is_early_bird IS 'Whether the user was an early bird when they submitted this feedback';
COMMENT ON COLUMN feedback.status IS 'Review status: new, reviewed, actioned, or closed';

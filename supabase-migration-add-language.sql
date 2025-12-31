-- Migration: Add language support to sessions table
-- Run this migration to add language field to sessions

ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS language VARCHAR(2) DEFAULT 'en' CHECK (language IN ('en', 'es'));

-- Update existing sessions to default to English
UPDATE sessions SET language = 'en' WHERE language IS NULL;

-- Create index for language queries
CREATE INDEX IF NOT EXISTS idx_sessions_language ON sessions(language);


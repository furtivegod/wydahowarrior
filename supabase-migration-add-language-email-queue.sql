-- Migration: Add language support to email_queue table
-- Run this migration to add language field to email_queue

ALTER TABLE email_queue 
ADD COLUMN IF NOT EXISTS language VARCHAR(2) DEFAULT 'en' CHECK (language IN ('en', 'es'));

-- Update existing email_queue entries to default to English
UPDATE email_queue SET language = 'en' WHERE language IS NULL;

-- Create index for language queries
CREATE INDEX IF NOT EXISTS idx_email_queue_language ON email_queue(language);



-- Recurring Tasks Migration
-- Run this in your Supabase SQL Editor (SQL Editor > New Query)

-- Add recurrence columns to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recurrence_pattern TEXT DEFAULT NULL
  CHECK (recurrence_pattern IN ('daily', 'weekly', 'monthly'));

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recurrence_end_date TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recurrence_day_of_week INTEGER DEFAULT NULL
  CHECK (recurrence_day_of_week >= 0 AND recurrence_day_of_week <= 6);

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recurrence_day_of_month INTEGER DEFAULT NULL
  CHECK (recurrence_day_of_month >= 1 AND recurrence_day_of_month <= 31);

-- Index for finding recurring tasks efficiently
CREATE INDEX IF NOT EXISTS idx_tasks_recurrence
  ON tasks(recurrence_pattern)
  WHERE recurrence_pattern IS NOT NULL;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'tasks'
AND column_name LIKE 'recurrence%';

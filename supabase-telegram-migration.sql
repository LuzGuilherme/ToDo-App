-- Telegram Integration Migration
-- Run this in your Supabase SQL Editor (SQL Editor > New Query)

-- Add telegram_chat_id column to user_settings
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT;

-- Create an index for faster lookups by telegram_chat_id
CREATE INDEX IF NOT EXISTS idx_user_settings_telegram_chat_id
ON user_settings(telegram_chat_id)
WHERE telegram_chat_id IS NOT NULL;

-- Create a policy to allow service role to update telegram_chat_id
-- (The webhook needs to update this field when users connect)
-- Note: This is handled by using SUPABASE_SERVICE_ROLE_KEY in the webhook

-- Verify the column was added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'user_settings'
AND column_name = 'telegram_chat_id';

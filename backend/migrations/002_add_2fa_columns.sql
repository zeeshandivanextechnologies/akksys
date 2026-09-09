-- Add 2FA columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS sms_auth BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_auth BOOLEAN DEFAULT false;

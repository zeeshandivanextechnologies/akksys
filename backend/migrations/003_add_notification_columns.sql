-- Add notification preference columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_alerts BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS scan_alerts BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS weekly_report BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS campaign_updates BOOLEAN DEFAULT false;

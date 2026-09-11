ALTER TABLE landing_content ADD COLUMN IF NOT EXISTS legal_pages JSONB DEFAULT '{}';

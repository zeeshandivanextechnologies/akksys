-- AKKSYS Database Schema
-- Run this file to create all tables

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS qr_codes (
  id SERIAL PRIMARY KEY,
  qr_id VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused')),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  qr_id INTEGER REFERENCES qr_codes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  start_date DATE,
  end_date DATE,
  headline VARCHAR(500),
  tagline VARCHAR(500),
  badge VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_versions (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  video_type VARCHAR(50) DEFAULT 'library',
  video_url TEXT,
  cta_text VARCHAR(100) DEFAULT 'Buy Now',
  cta_destination TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(campaign_id, version_number)
);

CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  video_url TEXT NOT NULL,
  video_type VARCHAR(50) DEFAULT 'mp4',
  duration VARCHAR(20),
  size VARCHAR(20),
  uploaded_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cta_buttons (
  id SERIAL PRIMARY KEY,
  button_text VARCHAR(100) NOT NULL,
  destination_url TEXT NOT NULL,
  qr_id INTEGER REFERENCES qr_codes(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scan_events (
  id SERIAL PRIMARY KEY,
  qr_id INTEGER REFERENCES qr_codes(id) ON DELETE CASCADE,
  version_id INTEGER REFERENCES campaign_versions(id) ON DELETE SET NULL,
  session_id VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  device_type VARCHAR(50),
  device_os VARCHAR(100),
  browser VARCHAR(100),
  city VARCHAR(100),
  country VARCHAR(10),
  scanned_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cta_clicks (
  id SERIAL PRIMARY KEY,
  version_id INTEGER REFERENCES campaign_versions(id) ON DELETE SET NULL,
  qr_id INTEGER REFERENCES qr_codes(id) ON DELETE SET NULL,
  session_id VARCHAR(255),
  device_type VARCHAR(50),
  city VARCHAR(100),
  country VARCHAR(10),
  clicked_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  company_name VARCHAR(255) DEFAULT 'AKKSYS',
  primary_color VARCHAR(20) DEFAULT '#00C8FF',
  secondary_color VARCHAR(20) DEFAULT '#4DDCFF',
  logo_url TEXT,
  favicon_url TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_scan_events_qr_id ON scan_events(qr_id);
CREATE INDEX IF NOT EXISTS idx_scan_events_version_id ON scan_events(version_id);
CREATE INDEX IF NOT EXISTS idx_scan_events_scanned_at ON scan_events(scanned_at);
CREATE INDEX IF NOT EXISTS idx_scan_events_session_id ON scan_events(session_id);
CREATE INDEX IF NOT EXISTS idx_cta_clicks_version_id ON cta_clicks(version_id);
CREATE INDEX IF NOT EXISTS idx_cta_clicks_qr_id ON cta_clicks(qr_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_qr_id ON campaigns(qr_id);
CREATE INDEX IF NOT EXISTS idx_campaign_versions_campaign_id ON campaign_versions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_qr_id ON qr_codes(qr_id);

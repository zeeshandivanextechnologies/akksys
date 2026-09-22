-- Lead Capture Form

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  qr_id INTEGER REFERENCES qr_codes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255),
  company VARCHAR(255),
  city VARCHAR(100),
  device_type VARCHAR(50),
  device_os VARCHAR(100),
  browser VARCHAR(100),
  ip_address VARCHAR(45),
  country VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS form_enabled BOOLEAN DEFAULT false;

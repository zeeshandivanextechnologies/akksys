-- Categories for QR Codes

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;

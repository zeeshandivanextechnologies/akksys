CREATE TABLE IF NOT EXISTS redirect_presets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  icon VARCHAR(50) DEFAULT 'globe',
  color VARCHAR(20) DEFAULT '#6943c8',
  display_order INTEGER DEFAULT 0,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

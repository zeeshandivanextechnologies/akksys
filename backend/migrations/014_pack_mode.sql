-- Pack Mode: Boxes table and box assignment for QR codes

CREATE TABLE IF NOT EXISTS boxes (
  id SERIAL PRIMARY KEY,
  box_number VARCHAR(50) UNIQUE NOT NULL,
  product_name VARCHAR(255),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'sealed', 'shipped')),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE qr_codes 
ADD COLUMN IF NOT EXISTS box_id INTEGER REFERENCES boxes(id) ON DELETE SET NULL;

ALTER TABLE qr_codes
ADD COLUMN IF NOT EXISTS packed_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_boxes_box_number ON boxes(box_number);
CREATE INDEX IF NOT EXISTS idx_qr_codes_box_id ON qr_codes(box_id);

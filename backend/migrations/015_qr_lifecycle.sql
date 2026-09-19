-- QR Lifecycle Status Tracking

ALTER TABLE qr_codes 
ADD COLUMN IF NOT EXISTS lifecycle_status VARCHAR(20) DEFAULT 'generated' 
CHECK (lifecycle_status IN ('generated', 'printed', 'packed', 'sold'));

ALTER TABLE qr_codes
ADD COLUMN IF NOT EXISTS first_scan_at TIMESTAMP;

ALTER TABLE qr_codes
ADD COLUMN IF NOT EXISTS printed_at TIMESTAMP;

ALTER TABLE qr_codes
ADD COLUMN IF NOT EXISTS sold_at TIMESTAMP;

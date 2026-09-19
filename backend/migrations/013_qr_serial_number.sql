CREATE SEQUENCE IF NOT EXISTS qr_serial_seq START 1;

ALTER TABLE qr_codes 
ADD COLUMN IF NOT EXISTS qr_serial_number VARCHAR(50) 
DEFAULT 'AKK' || LPAD(nextval('qr_serial_seq')::text, 4, '0') UNIQUE;

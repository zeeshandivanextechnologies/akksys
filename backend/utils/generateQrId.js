import crypto from 'crypto';
import { QR_ID_LENGTH, QR_ID_CHARS } from '../config/constants.js';
import { db } from '../config/db.js';

export const generateQrId = async () => {
  let qrId;
  let exists = true;

  while (exists) {
    qrId = '';
    const bytes = crypto.randomBytes(QR_ID_LENGTH);
    for (let i = 0; i < QR_ID_LENGTH; i++) {
      qrId += QR_ID_CHARS[bytes[i] % QR_ID_CHARS.length];
    }
    const result = await db.query('SELECT id FROM qr_codes WHERE qr_id = $1', [qrId]);
    exists = result.rows.length > 0;
  }

  return qrId;
};

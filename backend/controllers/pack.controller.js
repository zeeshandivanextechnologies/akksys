import { db } from '../config/db.js';

export const createBox = async (req, res, next) => {
  try {
    const { box_number, product_name } = req.body;
    if (!box_number) {
      return res.status(400).json({ error: 'Box number is required' });
    }
    const result = await db.query(
      'INSERT INTO boxes (box_number, product_name, created_by) VALUES ($1, $2, $3) RETURNING *',
      [box_number, product_name || null, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Box number already exists' });
    }
    next(err);
  }
};

export const listBoxes = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT b.*, 
        (SELECT COUNT(*) FROM qr_codes WHERE box_id = b.id) as qr_count
       FROM boxes b ORDER BY b.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getBoxById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const boxResult = await db.query('SELECT * FROM boxes WHERE id = $1', [id]);
    if (boxResult.rows.length === 0) {
      return res.status(404).json({ error: 'Box not found' });
    }
    const qrResult = await db.query(
      `SELECT q.*, 
        (SELECT COUNT(*) FROM scan_events WHERE qr_id = q.id) as total_scans
       FROM qr_codes q WHERE q.box_id = $1 ORDER BY q.qr_serial_number`,
      [id]
    );
    res.json({ ...boxResult.rows[0], qr_codes: qrResult.rows });
  } catch (err) {
    next(err);
  }
};

export const assignQRToBox = async (req, res, next) => {
  try {
    const { qr_serial_number, box_id } = req.body;
    if (!qr_serial_number || !box_id) {
      return res.status(400).json({ error: 'QR serial number and box ID are required' });
    }
    
    const qrResult = await db.query(
      'SELECT id FROM qr_codes WHERE qr_serial_number = $1',
      [qr_serial_number]
    );
    if (qrResult.rows.length === 0) {
      return res.status(404).json({ error: 'QR code not found with this serial number' });
    }

    const boxCheck = await db.query('SELECT id FROM boxes WHERE id = $1', [box_id]);
    if (boxCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Box not found' });
    }

    const updateResult = await db.query(
      `UPDATE qr_codes SET box_id = $1, packed_at = NOW(), 
       lifecycle_status = CASE WHEN lifecycle_status = 'generated' THEN 'packed' ELSE lifecycle_status END,
       updated_at = NOW() 
       WHERE id = $2 RETURNING *`,
      [box_id, qrResult.rows[0].id]
    );
    res.json(updateResult.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const scanToPack = async (req, res, next) => {
  try {
    const { qr_serial_number } = req.body;
    if (!qr_serial_number) {
      return res.status(400).json({ error: 'QR serial number is required' });
    }

    const activeBox = await db.query(
      `SELECT id, box_number FROM boxes WHERE status = 'open' ORDER BY created_at DESC LIMIT 1`
    );
    if (activeBox.rows.length === 0) {
      return res.status(400).json({ error: 'No open box found. Create a box first.' });
    }

    const qrResult = await db.query(
      'SELECT id, box_id FROM qr_codes WHERE qr_serial_number = $1',
      [qr_serial_number]
    );
    if (qrResult.rows.length === 0) {
      return res.status(404).json({ error: 'QR code not found with this serial number' });
    }

    if (qrResult.rows[0].box_id) {
      return res.status(400).json({ error: 'QR code is already assigned to a box' });
    }

    const box = activeBox.rows[0];
    const updateResult = await db.query(
      `UPDATE qr_codes SET box_id = $1, packed_at = NOW(), 
       lifecycle_status = 'packed', updated_at = NOW() 
       WHERE id = $2 RETURNING *`,
      [box.id, qrResult.rows[0].id]
    );
    res.json({ qr: updateResult.rows[0], box_number: box.box_number });
  } catch (err) {
    next(err);
  }
};

export const sealBox = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `UPDATE boxes SET status = 'sealed', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Box not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteBox = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE qr_codes SET box_id = NULL, packed_at = NULL WHERE box_id = $1', [id]);
    const result = await db.query('DELETE FROM boxes WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Box not found' });
    }
    res.json({ message: 'Box deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const updateLifecycleStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['generated', 'printed', 'packed', 'sold'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const timestampField = {
      printed: 'printed_at',
      packed: 'packed_at',
      sold: 'sold_at',
    };
    
    let query = `UPDATE qr_codes SET lifecycle_status = $1, updated_at = NOW()`;
    const params = [status];
    
    if (timestampField[status]) {
      query += `, ${timestampField[status]} = COALESCE(${timestampField[status]}, NOW())`;
    }
    
    query += ` WHERE id = $2 RETURNING *`;
    params.push(id);

    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'QR code not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

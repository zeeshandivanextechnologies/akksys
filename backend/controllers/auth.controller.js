import { generateToken } from '../utils/generateToken.js';
import { comparePassword } from '../utils/hashPassword.js';
import { db } from '../config/db.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const validPassword = await comparePassword(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.json({ message: 'If email exists, a reset link has been sent.' });
    }
    // TODO: Send reset email
    res.json({ message: 'If email exists, a reset link has been sent.' });
  } catch (err) {
    next(err);
  }
};

import { generateToken } from '../utils/generateToken.js';
import { comparePassword } from '../utils/hashPassword.js';
import { db } from '../config/db.js';
import nodemailer from 'nodemailer';

// Simple in-memory cache for OTP (demo purposes)
global.otpCache = global.otpCache || {};

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

    if (user.email_auth) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      global.otpCache[email] = otp;
      
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'zeeshandivanextechnologies@gmail.com', // Replace with the actual email if different
            pass: 'swlw zkin cbwv rvja'
          },
          connectionTimeout: 5000, // Important for Render free tier so it doesn't hang
          greetingTimeout: 5000,
          socketTimeout: 5000
        });

        const htmlTemplate = `
        <div style="font-family: 'Inter', Arial, sans-serif; background-color: #f4f7f6; padding: 40px 20px; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.05);">
            <div style="background: linear-gradient(135deg, #00C8FF, #4DDCFF); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: 2px;">AKKSYS</h1>
              <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 14px;">Business Solutions Platform</p>
            </div>
            <div style="padding: 10px 30px; text-align: center;">
              <h2 style="color: #1a1a1a; margin-top: 0; font-size: 24px; font-weight: 600;">Secure Login Verification</h2>
              <p style="color: #555555; font-size: 15px; line-height: 1.6; margin-bottom: 16px;">
                We received a request to sign in to your AKKSYS Admin dashboard. To securely access your account, please use the following verification code:
              </p>
              <div style="background-color: #f8fbff; border: 2px dashed #00C8FF; border-radius: 10px; padding: 20px; display: inline-block; margin-bottom: 16px;">
                <span style="font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #00C8FF;">${otp}</span>
              </div>
              <p style="color: #888888; font-size: 14px; margin-bottom: 0; line-height: 1.5;">
                This code is valid only for your current session.<br/>If you didn't request this login, please change your password immediately.
              </p>
            </div>
            <div style="background-color: #fafbfc; padding: 16px; text-align: center; border-top: 1px solid #eeeeee;">
              <p style="color: #999999; font-size: 14px; margin: 0;">
                &copy; ${new Date().getFullYear()} AKKSYS. All rights reserved.
              </p>
            </div>
          </div>
        </div>
        `;

        const mailOptions = {
          from: 'AKKSYS Security <zeeshandivanextechnologies@gmail.com>',
          to: user.email,
          subject: 'AKKSYS - Your Secure Login OTP',
          html: htmlTemplate
        };

        await transporter.sendMail(mailOptions);
        console.log(`[2FA DEMO] Sent OTP ${otp} via Email to ${user.email}`);
      } catch (emailErr) {
        console.error('Failed to send email:', emailErr);
        // Fallback to console if email fails
        console.log(`\n\n==========================================`);
        console.log(`[2FA DEMO] OTP for ${email}: ${otp}`);
        console.log(`==========================================\n\n`);
      }

      return res.json({ requires2FA: true, email: user.email, message: 'OTP sent to your email' });
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

export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    if (global.otpCache[email] !== otp) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    delete global.otpCache[email];

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = result.rows[0];
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

// EMERGENCY ROUTE TO DISABLE 2FA (Since you are locked out on Render)
export const emergencyDisable2FA = async (req, res, next) => {
  try {
    await db.query('UPDATE users SET email_auth = false, sms_auth = false');
    res.send('<h1>Emergency Unlock Successful!</h1><p>2FA has been turned OFF for all users. You can now go back and login normally.</p>');
  } catch (err) {
    next(err);
  }
};

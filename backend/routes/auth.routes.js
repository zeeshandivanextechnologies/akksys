import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { login, forgotPassword } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', authLimiter, [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
], login);

router.post('/forgot-password', authLimiter, [
  body('email').isEmail().withMessage('Valid email is required'),
  validate,
], forgotPassword);

export default router;

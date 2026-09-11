import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { getProfile, updateProfile, changePassword, getTwoFactor, updateTwoFactor, getNotifications, updateNotifications, getAdminNotifications } from '../controllers/user.controller.js';

const router = Router();
router.use(apiLimiter);

router.get('/profile', auth, getProfile);
router.put('/profile', auth, [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  validate,
], updateProfile);
router.put('/password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  validate,
], changePassword);
router.get('/two-factor', auth, getTwoFactor);
router.put('/two-factor', auth, updateTwoFactor);
router.get('/notifications', auth, getNotifications);
router.put('/notifications', auth, updateNotifications);
router.get('/admin-notifications', auth, getAdminNotifications);

export default router;

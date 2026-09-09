import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';

const router = Router();
router.use(apiLimiter);

router.get('/', auth, getSettings);
router.put('/', auth, updateSettings);

export default router;

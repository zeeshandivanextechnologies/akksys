import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { listPresets, createPreset, updatePreset, deletePreset } from '../controllers/redirectPresets.controller.js';

const router = Router();
router.use(apiLimiter);

router.get('/', auth, listPresets);
router.post('/create', auth, createPreset);
router.put('/:id', auth, updatePreset);
router.delete('/:id', auth, deletePreset);

export default router;

import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { listStaticQR, getStaticQR, createStaticQR, updateStaticQR, toggleStaticQR, deleteStaticQR } from '../controllers/staticQr.controller.js';

const router = Router();
router.use(apiLimiter);

router.get('/', auth, listStaticQR);
router.get('/:id', auth, getStaticQR);
router.post('/create', auth, createStaticQR);
router.put('/:id', auth, updateStaticQR);
router.put('/:id/toggle', auth, toggleStaticQR);
router.delete('/:id', auth, deleteStaticQR);

export default router;

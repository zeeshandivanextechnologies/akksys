import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { listQRCodes, createQR, getQRById, updateQR, toggleQR, deleteQR, bulkGenerate } from '../controllers/qr.controller.js';

const router = Router();
router.use(apiLimiter);

router.get('/', auth, listQRCodes);
router.post('/create', auth, createQR);
router.get('/:id', auth, getQRById);
router.put('/:id', auth, updateQR);
router.put('/:id/toggle', auth, toggleQR);
router.delete('/:id', auth, deleteQR);
router.post('/bulk', auth, bulkGenerate);

export default router;

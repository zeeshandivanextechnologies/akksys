import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import {
  createBox, listBoxes, getBoxById, assignQRToBox,
  scanToPack, sealBox, deleteBox, updateLifecycleStatus
} from '../controllers/pack.controller.js';

const router = Router();
router.use(apiLimiter);

router.get('/boxes', auth, listBoxes);
router.post('/boxes', auth, createBox);
router.get('/boxes/:id', auth, getBoxById);
router.delete('/boxes/:id', auth, deleteBox);
router.put('/boxes/:id/seal', auth, sealBox);

router.post('/assign', auth, assignQRToBox);
router.post('/scan-pack', auth, scanToPack);
router.put('/lifecycle/:id', auth, updateLifecycleStatus);

export default router;

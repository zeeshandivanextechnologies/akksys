import { Router } from 'express';
import { scanLimiter } from '../middleware/rateLimiter.js';
import { getLandingData, trackCTAClick } from '../controllers/landing.controller.js';

const router = Router();

router.get('/:qrId', scanLimiter, getLandingData);
router.post('/:versionId/click', trackCTAClick);

export default router;

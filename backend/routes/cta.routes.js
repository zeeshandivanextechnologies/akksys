import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { listCTAs, createCTA, updateCTA } from '../controllers/cta.controller.js';

const router = Router();
router.use(apiLimiter);

router.get('/', auth, listCTAs);
router.post('/create', auth, createCTA);
router.put('/:id', auth, updateCTA);

export default router;

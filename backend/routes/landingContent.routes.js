import { Router } from 'express';
import { getLandingContent, updateLandingContent, getLandingStats } from '../controllers/landingContent.controller.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/content', getLandingContent);
router.put('/content', auth, updateLandingContent);
router.get('/stats', getLandingStats);

export default router;

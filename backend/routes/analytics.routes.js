import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { getOverview, getQRAnalytics, getCampaignAnalytics, getVersionAnalytics, getDeviceAnalytics, getLocationAnalytics, getQRDetailAnalytics } from '../controllers/analytics.controller.js';

const router = Router();
router.use(apiLimiter);

router.get('/overview', auth, getOverview);
router.get('/qr', auth, getQRAnalytics);
router.get('/qr/:id', auth, getQRDetailAnalytics);
router.get('/campaign', auth, getCampaignAnalytics);
router.get('/version', auth, getVersionAnalytics);
router.get('/devices', auth, getDeviceAnalytics);
router.get('/locations', auth, getLocationAnalytics);

export default router;

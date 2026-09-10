import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { listCampaigns, createCampaign, getCampaignById, updateCampaign, createVersion, deleteCampaign, getCampaignStats } from '../controllers/campaign.controller.js';

const router = Router();
router.use(apiLimiter);

router.get('/stats', auth, getCampaignStats);
router.get('/', auth, listCampaigns);
router.post('/create', auth, createCampaign);
router.get('/:id', auth, getCampaignById);
router.put('/:id', auth, updateCampaign);
router.delete('/:id', auth, deleteCampaign);
router.post('/:id/version', auth, createVersion);

export default router;

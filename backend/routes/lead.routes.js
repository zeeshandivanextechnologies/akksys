import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { checkFormEnabled, submitLead, getLeads, getLeadsByQR, deleteLead } from '../controllers/lead.controller.js';

const router = Router();
router.use(apiLimiter);

router.get('/form/:qrId', checkFormEnabled);
router.post('/submit/:qrId', submitLead);
router.get('/', auth, getLeads);
router.get('/qr/:qrId', auth, getLeadsByQR);
router.delete('/:id', auth, deleteLead);

export default router;

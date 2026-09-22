import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller.js';

const router = Router();
router.use(apiLimiter);

router.get('/', auth, getCategories);
router.post('/', auth, createCategory);
router.put('/:id', auth, updateCategory);
router.delete('/:id', auth, deleteCategory);

export default router;

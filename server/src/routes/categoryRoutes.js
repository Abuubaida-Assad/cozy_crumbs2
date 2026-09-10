import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { authenticateUser, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(authenticateUser, requireAdmin, createCategory);

router.route('/:idOrSlug')
  .get(getCategoryById);

router.route('/:id')
  .put(authenticateUser, requireAdmin, updateCategory)
  .delete(authenticateUser, requireAdmin, deleteCategory);

export default router;

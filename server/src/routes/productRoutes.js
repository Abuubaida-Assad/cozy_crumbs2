import express from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleAvailability,
  toggleFeatured,
  toggleSeasonal,
} from '../controllers/productController.js';
import { authenticateUser, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(authenticateUser, requireAdmin, createProduct);

router.get('/featured', getFeaturedProducts);

router.route('/:idOrSlug')
  .get(getProductById);

router.route('/:id')
  .put(authenticateUser, requireAdmin, updateProduct)
  .delete(authenticateUser, requireAdmin, deleteProduct);

router.patch('/:id/toggle-availability', authenticateUser, requireAdmin, toggleAvailability);
router.patch('/:id/toggle-featured', authenticateUser, requireAdmin, toggleFeatured);
router.patch('/:id/toggle-seasonal', authenticateUser, requireAdmin, toggleSeasonal);

export default router;

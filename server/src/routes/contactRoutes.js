import express from 'express';
import { submitContact, getContactMessages, updateMessageStatus, deleteContactMessage } from '../controllers/contactController.js';
import { authenticateUser, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(submitContact)
  .get(authenticateUser, requireAdmin, getContactMessages);

router.route('/:id')
  .delete(authenticateUser, requireAdmin, deleteContactMessage);

router.patch('/:id/status', authenticateUser, requireAdmin, updateMessageStatus);

export default router;

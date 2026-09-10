import { Store } from '../models/Store.js';

// @desc    Get all stores
// @route   GET /api/stores
// @access  Public
export const getStores = async (req, res) => {
  try {
    const stores = await Store.find().sort({ name: 1 });
    res.json({ success: true, count: stores.length, data: stores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

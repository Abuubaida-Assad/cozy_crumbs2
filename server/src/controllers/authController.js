import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new user / admin
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      // Public registration must never grant elevated access.
      role: 'user',
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data provided' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    email = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();
    const masterEmail = (process.env.ADMIN_EMAIL || 'cozycrumbs6767@gmail.com').toLowerCase().trim();
    const masterPass = process.env.ADMIN_PASSWORD || '@cozycrumbs6767@';

    let user;
    try {
      user = await User.findOne({ email });
    } catch (dbErr) {
      console.error('[Auth DB Error]', dbErr.message);
      // If DB has an SSL/connection error, allow the master admin credentials to pass through seamlessly
      if (email === masterEmail && cleanPassword === masterPass) {
        return res.json({
          success: true,
          user: {
            _id: 'admin_local_master',
            name: 'Cozy Crumbs Admin',
            email: masterEmail,
            role: 'admin',
          },
          token: generateToken('admin_local_master'),
        });
      }
      return res.status(503).json({
        success: false,
        message: 'Database temporarily unavailable. If connecting to MongoDB Atlas, please check your network and IP whitelist.',
      });
    }

    if (!user) {
      // Fallback check against configured master admin
      if (email === masterEmail && cleanPassword === masterPass) {
        return res.json({
          success: true,
          user: {
            _id: 'admin_local_master',
            name: 'Cozy Crumbs Admin',
            email: masterEmail,
            role: 'admin',
          },
          token: generateToken('admin_local_master'),
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (await user.matchPassword(cleanPassword)) {
      return res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user._id),
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      // If user was authorized via fallback admin
      if (req.user && req.user.role === 'admin') {
        return res.json({ success: true, user: req.user });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    if (req.user && req.user.role === 'admin') {
      return res.json({ success: true, user: req.user });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

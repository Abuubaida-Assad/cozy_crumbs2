import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config(); // fallback

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Configure CORS for production and development
const defaultOrigins = [
  'https://cozy-crumbs-rosy.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5050',
];
const envOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];
const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

app.use(cors({
  origin(origin, callback) {
    // Allow non-browser requests (curl, server-to-server proxies)
    if (!origin) return callback(null, true);
    // Allow configured origins or any Vercel preview deployment for this project
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check / API info (does not require DB connection)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'Cozy Crumbs Artisanal Bakery API',
    time: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    serverless: Boolean(process.env.VERCEL),
  });
});

// Root route for backend health/status
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'Cozy Crumbs API Backend',
    endpoints: {
      health: '/api/health',
      categories: '/api/categories',
      products: '/api/products',
      stores: '/api/stores',
      login: '/api/auth/login',
    },
  });
});

// Mount Static Uploads (safely handled on read-only serverless filesystem)
const uploadsDir = path.resolve(__dirname, '../uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) {
  // Read-only filesystem in serverless environments
}
app.use('/uploads', express.static(uploadsDir));

// Database connection middleware for all API routes (ensures DB is connected before controllers run)
app.use(async (req, res, next) => {
  if (!req.path.startsWith('/api') || req.path === '/api/health') {
    return next();
  }

  try {
    await connectDB();
    next();
  } catch (dbErr) {
    console.error('[DB Middleware Error]:', dbErr.message);
    return res.status(503).json({
      success: false,
      message: dbErr.message,
    });
  }
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/upload', uploadRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5050;

let server;
export const startServer = async () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️ Warning: JWT_SECRET should be set to at least 32 characters in production.');
  }

  await connectDB();
  server = app.listen(PORT, () => {
    console.log(`[Cozy Crumbs Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  const shutdown = () => server.close(() => process.exit(0));
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
};

// Standalone execution: only call app.listen if running directly, NOT in Vercel serverless functions
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  startServer().catch((error) => {
    console.error(`[Startup Error] ${error.message}`);
    process.exit(1);
  });
}

export default app;

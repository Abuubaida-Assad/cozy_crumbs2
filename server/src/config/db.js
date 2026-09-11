import dns from 'dns';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Store } from '../models/Store.js';
import { seedCategories, seedProductsData, seedStores } from '../utils/seedData.js';

let mongoMemoryInstance = null;
let cachedConnectionPromise = null;
let isDbInitialized = false;

// Only apply custom DNS servers in local development when needed
if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {
    // ignore DNS override error
  }
}

export const ensureAdminUser = async () => {
  try {
    const primaryAdminEmail = (process.env.ADMIN_EMAIL || 'cozycrumbs6767@gmail.com').toLowerCase().trim();
    const primaryAdminPass = process.env.ADMIN_PASSWORD || '@cozycrumbs6767@';

    let admin = await User.findOne({ email: primaryAdminEmail });
    if (!admin) {
      admin = await User.findOne({ role: 'admin' });
      if (admin) {
        admin.name = 'Cozy Crumbs Admin';
        admin.email = primaryAdminEmail;
        admin.password = primaryAdminPass;
        await admin.save();
        console.log(`[DB Init] Admin user updated to ${primaryAdminEmail}`);
      } else {
        await User.create({
          name: 'Cozy Crumbs Admin',
          email: primaryAdminEmail,
          password: primaryAdminPass,
          role: 'admin',
        });
        console.log(`[DB Init] Admin user created for ${primaryAdminEmail}`);
      }
    } else {
      const isMatch = await admin.matchPassword(primaryAdminPass);
      if (!isMatch) {
        admin.password = primaryAdminPass;
        await admin.save();
        console.log(`[DB Init] Admin password synchronized for ${primaryAdminEmail}`);
      }
    }
  } catch (err) {
    console.error('[DB Init Error] Failed to ensure admin user:', err.message);
  }
};

export const autoSeedIfEmpty = async () => {
  try {
    if (process.env.AUTO_SEED !== 'true') return;

    const categoryCount = await Category.countDocuments();
    const productCount = await Product.countDocuments();
    const storeCount = await Store.countDocuments();

    if (categoryCount === 0 && productCount === 0) {
      console.log('[DB Init] Database is empty. Running automatic seed data initialization...');

      // Categories
      const createdCategories = await Category.insertMany(seedCategories);
      const categoryMap = {};
      createdCategories.forEach((cat) => {
        categoryMap[cat.name] = cat._id;
      });

      // Products
      const productsToInsert = seedProductsData.map((prod) => ({
        name: prod.name,
        slug: prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        description: prod.description,
        price: prod.price,
        weight: prod.weight,
        image: prod.image,
        category: categoryMap[prod.categoryName],
        isVeg: prod.isVeg,
        isEggless: prod.isEggless,
        isFeatured: prod.isFeatured,
        isAvailable: prod.isAvailable,
        displayOrder: prod.displayOrder,
        ingredients: prod.ingredients,
        nutritionalInfo: prod.nutritionalInfo,
      }));

      await Product.insertMany(productsToInsert);
      console.log(`[DB Init] Auto-seeded ${productsToInsert.length} products.`);
    }

    if (storeCount === 0) {
      await Store.insertMany(seedStores);
      console.log(`[DB Init] Auto-seeded ${seedStores.length} stores.`);
    }
    console.log('✅ [DB Init] Auto-seeding completed.');
  } catch (err) {
    console.error('[DB Init Error] Auto-seeding error:', err.message);
  }
};

export const connectDB = async () => {
  // 1. Return active connection if already connected (warm serverless container)
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // 2. Return in-flight connection promise if currently connecting
  if (cachedConnectionPromise) {
    return cachedConnectionPromise;
  }

  const uri = process.env.MONGO_URI;

  if (!uri) {
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      throw new Error('MONGO_URI is not set in Vercel environment variables. Please add MONGO_URI in your Vercel project settings.');
    }
  }

  // 3. Initiate connection and cache promise
  cachedConnectionPromise = (async () => {
    try {
      if (!uri) {
        throw new Error('MONGO_URI must be configured. Use ALLOW_IN_MEMORY_DB=true only for local development.');
      }

      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        dbName: 'cozy_crumbs',
        bufferCommands: false, // In serverless, fail fast instead of buffering indefinitely
      });

      console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);

      // Run seeding / admin setup only once per container lifecycle
      if (!isDbInitialized) {
        isDbInitialized = true;
        await ensureAdminUser().catch((e) => console.warn('[DB Init] Admin ensure error:', e.message));
        await autoSeedIfEmpty().catch((e) => console.warn('[DB Init] Auto-seed error:', e.message));
      }

      return conn;
    } catch (error) {
      cachedConnectionPromise = null; // Clear so subsequent requests can retry

      if (process.env.NODE_ENV === 'production' || process.env.VERCEL || process.env.ALLOW_IN_MEMORY_DB !== 'true') {
        let msg = error.message;
        if (msg.includes('SSL') || msg.includes('tlsv1') || msg.includes('whitelist') || msg.includes('80')) {
          msg = `MongoDB Atlas SSL connection error (SSL alert 80). Ensure your MongoDB Atlas cluster has IP Access List set to 0.0.0.0/0 (allow access from anywhere) so Vercel serverless IPs can connect.`;
        }
        throw new Error(msg);
      }

      console.warn(`[MongoDB] Standard connection to ${uri} failed (${error.message}).`);
      console.log('[MongoDB] Initializing development-only in-memory MongoDB fallback...');

      try {
        await mongoose.disconnect().catch(() => {});

        const { MongoMemoryServer } = await import('mongodb-memory-server');
        if (!mongoMemoryInstance) {
          mongoMemoryInstance = await MongoMemoryServer.create();
        }
        const memUri = mongoMemoryInstance.getUri();

        const conn = await mongoose.connect(memUri, {
          dbName: 'cozy_crumbs',
          bufferCommands: false,
        });
        console.log(`[MongoDB] In-Memory Server Active: ${memUri}`);

        if (!isDbInitialized) {
          isDbInitialized = true;
          await ensureAdminUser().catch((e) => console.warn('[DB Init] Admin ensure error:', e.message));
          await autoSeedIfEmpty().catch((e) => console.warn('[DB Init] Auto-seed error:', e.message));
        }

        return conn;
      } catch (memErr) {
        throw new Error(`In-memory MongoDB fallback failed: ${memErr.message}`);
      }
    }
  })();

  return cachedConnectionPromise;
};

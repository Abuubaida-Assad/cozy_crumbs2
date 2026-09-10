import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Store } from '../models/Store.js';
import { seedCategories, seedProductsData, seedStores } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error('MONGO_URI, ADMIN_EMAIL, and ADMIN_PASSWORD must be configured before seeding.');
    }
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected successfully.');

    // 1. Clear existing collections
    console.log('[Seed] Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Store.deleteMany({});

    // 2. Seed Admin User(s)
    const primaryAdminEmail = process.env.ADMIN_EMAIL;
    const primaryAdminPass = process.env.ADMIN_PASSWORD;

    console.log('[Seed] Creating admin accounts...');
    const adminUser = await User.create({
      name: 'Cozy Crumbs Admin',
      email: primaryAdminEmail.toLowerCase(),
      password: primaryAdminPass,
      role: 'admin',
    });

    console.log(`[Seed] Admin user created: ${adminUser.email}`);

    // 3. Seed Categories (Only the 6 core categories)
    console.log('[Seed] Seeding categories...');
    const createdCategories = await Category.insertMany(seedCategories);
    console.log(`[Seed] Seeded ${createdCategories.length} categories.`);

    // Map category name to _id
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // 4. Seed Products
    console.log('[Seed] Seeding products...');
    const productsToInsert = seedProductsData.map((prod) => {
      const categoryId = categoryMap[prod.categoryName];
      if (!categoryId) {
        throw new Error(`Category "${prod.categoryName}" not found in categoryMap`);
      }
      return {
        name: prod.name,
        slug: prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        description: prod.description,
        price: prod.price,
        weight: prod.weight,
        image: prod.image,
        category: categoryId,
        isVeg: prod.isVeg,
        isEggless: prod.isEggless,
        isFeatured: prod.isFeatured,
        isAvailable: prod.isAvailable,
        displayOrder: prod.displayOrder,
        ingredients: prod.ingredients,
        nutritionalInfo: prod.nutritionalInfo,
      };
    });

    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`[Seed] Seeded ${createdProducts.length} bakery products.`);
    const createdStores = await Store.insertMany(seedStores);
    console.log(`[Seed] Seeded ${createdStores.length} stores.`);

    console.log('==================================================');
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`Admin Email: ${primaryAdminEmail}`);
    console.log(`Categories Seeded: ${createdCategories.length}`);
    console.log(`Products Seeded: ${createdProducts.length}`);
    console.log('==================================================');

    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();

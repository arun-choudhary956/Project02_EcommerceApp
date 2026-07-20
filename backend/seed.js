// Run with: npm run seed
// Creates one admin user and a handful of sample products so you have
// something to see immediately after setup.

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');

const sampleProducts = [
  {
    name: 'Wireless Headphones',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    price: 79.99,
    description: 'Over-ear wireless headphones with noise cancellation and 20-hour battery life.',
    stockCount: 25,
  },
  {
    name: 'Running Shoes',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    category: 'Footwear',
    price: 59.5,
    description: 'Lightweight running shoes with breathable mesh upper and cushioned sole.',
    stockCount: 40,
  },
  {
    name: 'Cotton T-Shirt',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    category: 'Clothing',
    price: 19.99,
    description: '100% cotton crew-neck t-shirt, available in multiple colors.',
    stockCount: 100,
  },
  {
    name: 'Stainless Steel Water Bottle',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    category: 'Home & Kitchen',
    price: 15.0,
    description: 'Insulated stainless steel bottle that keeps drinks cold for 24 hours.',
    stockCount: 60,
  },
  {
    name: 'Smart Watch',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Electronics',
    price: 129.99,
    description: 'Fitness-tracking smart watch with heart rate monitor and GPS.',
    stockCount: 15,
  },
  {
    name: 'Leather Wallet',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
    category: 'Accessories',
    price: 34.99,
    description: 'Genuine leather bifold wallet with RFID-blocking technology.',
    stockCount: 50,
  },
];

const seed = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({ username: 'admin' });

    // Create admin user - CHANGE THIS PASSWORD after first login in production
    await User.create({
      username: 'admin',
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log('Admin user created');

    await Product.insertMany(sampleProducts);
    console.log(`${sampleProducts.length} sample products inserted`);

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
};

seed();

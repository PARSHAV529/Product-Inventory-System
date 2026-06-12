const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const Category = require('../models/Category');

const categories = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Kitchen',
  'Sports',
  'Toys',
  'Health & Beauty',
  'Automotive',
  'Grocery',
  'Furniture',
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const docs = categories.map((name) => ({ name }));
    await Category.insertMany(docs, { ordered: false });
    console.log('Categories seeded successfully');
  } catch (error) {
    if (error.code === 11000 || error.writeErrors) {
      console.log('Some categories already existed, skipped duplicates');
    } else {
      console.error('Seeding failed:', error.message);
    }
  } finally {
    await mongoose.connection.close();
    console.log('DB connection closed');
  }
};

seedCategories();

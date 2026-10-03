// Fills the database with sample categories and menu items.
// Usage: npm run seed   (safe to run more than once)
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Category = require('../src/models/Category');
const MenuItem = require('../src/models/MenuItem');

const data = {
  Appetizers: [
    { name: 'Tostones', description: 'Fried green plantains with garlic sauce', price: 150, preparationTime: 10, ingredients: ['plantain', 'garlic', 'salt'] },
    { name: 'Yaniqueques', description: 'Crispy fried dough', price: 120, preparationTime: 8, ingredients: ['flour', 'salt', 'oil'] },
  ],
  'Main Dishes': [
    { name: 'La Bandera', description: 'Rice, red beans and stewed chicken', price: 380, preparationTime: 20, ingredients: ['rice', 'beans', 'chicken'] },
    { name: 'Sancocho', description: 'Traditional Dominican stew with seven meats', price: 450, preparationTime: 25, ingredients: ['beef', 'pork', 'yuca', 'plantain'] },
    { name: 'Mangu Completo', description: 'Mashed plantain with fried cheese, salami and eggs', price: 300, preparationTime: 15, ingredients: ['plantain', 'cheese', 'salami', 'eggs'] },
  ],
  Drinks: [
    { name: 'Passion Fruit Juice', description: 'Fresh juice made with chinola', price: 100, preparationTime: 5, ingredients: ['passion fruit', 'water', 'sugar'] },
    { name: 'Morir Sonando', description: 'Orange juice and milk', price: 110, preparationTime: 5, ingredients: ['orange', 'milk', 'sugar'] },
  ],
  Desserts: [
    { name: 'Tres Leches Cake', description: 'Sponge cake soaked in three milks', price: 200, preparationTime: 5, ingredients: ['flour', 'milk', 'eggs'] },
  ],
};

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  for (const [catName, items] of Object.entries(data)) {
    const category = await Category.findOneAndUpdate(
      { name: catName },
      { name: catName, description: `${catName} of the restaurant` },
      { upsert: true, new: true }
    );
    for (const item of items) {
      await MenuItem.findOneAndUpdate({ name: item.name }, { ...item, category: category._id }, { upsert: true });
    }
  }
  console.log('Seed finished: categories and menu items are ready.');
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

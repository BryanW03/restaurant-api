const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    available: { type: Boolean, default: true },
    preparationTime: { type: Number, min: 1, default: 15 },
    ingredients: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);

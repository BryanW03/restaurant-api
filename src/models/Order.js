const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], validate: (v) => v.length > 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'ready', 'delivered', 'cancelled'],
      default: 'pending',
    },
    orderType: { type: String, enum: ['dine-in', 'takeout', 'delivery'], required: true },
    tableNumber: { type: Number, min: 1 },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

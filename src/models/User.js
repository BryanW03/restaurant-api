const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    githubId: { type: String, unique: true, sparse: true },
    username: { type: String, required: true, unique: true, trim: true },
    displayName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    role: { type: String, enum: ['customer', 'staff', 'admin'], default: 'customer' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

const User = require('../models/User');
const { isStaff } = require('../middleware/auth');
const { pick, httpError, asyncHandler } = require('../utils/helpers');

const BASIC = ['displayName', 'email', 'phone'];
const ADMIN_ONLY = ['username', 'role', 'active'];

exports.getAll = asyncHandler(async (req, res) => {
  res.status(200).json(await User.find().sort('username'));
});

exports.getOne = asyncHandler(async (req, res) => {
  if (!isStaff(req.user) && req.user.id !== req.params.id) {
    throw httpError(403, 'You can only see your own profile');
  }
  const user = await User.findById(req.params.id);
  if (!user) throw httpError(404, 'User not found');
  res.status(200).json(user);
});

exports.create = asyncHandler(async (req, res) => {
  const user = await User.create(pick(req.body, [...BASIC, ...ADMIN_ONLY]));
  res.status(201).json(user);
});

exports.update = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  if (!isAdmin && req.user.id !== req.params.id) {
    throw httpError(403, 'You can only edit your own profile');
  }
  // Customers and staff can only change basic fields; role/active/username need an admin.
  const allowed = isAdmin ? [...BASIC, ...ADMIN_ONLY] : BASIC;
  const user = await User.findByIdAndUpdate(req.params.id, pick(req.body, allowed), {
    new: true,
    runValidators: true,
  });
  if (!user) throw httpError(404, 'User not found');
  res.status(200).json(user);
});

exports.remove = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw httpError(404, 'User not found');
  res.status(200).json({ message: 'User deleted' });
});

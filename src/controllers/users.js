const User = require('../models/User');
const { isStaff } = require('../middleware/auth');
const { pick, httpError } = require('../utils/helpers');

const BASIC = ['displayName', 'email', 'phone'];
const ADMIN_ONLY = ['username', 'role', 'active'];

exports.getAll = async (req, res, next) => {
  try {
    res.status(200).json(await User.find().sort('username'));
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    if (!isStaff(req.user) && req.user.id !== req.params.id) {
      throw httpError(403, 'You can only see your own profile');
    }
    const user = await User.findById(req.params.id);
    if (!user) throw httpError(404, 'User not found');
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const user = await User.create(pick(req.body, [...BASIC, ...ADMIN_ONLY]));
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && req.user.id !== req.params.id) {
      throw httpError(403, 'You can only edit your own profile');
    }
    // Customers and staff can only change basic fields; role/active/username need an admin.
    const allowed = isAdmin ? [...BASIC, ...ADMIN_ONLY] : BASIC;
    const user = await User.findByIdAndUpdate(req.params.id, pick(req.body, allowed), {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!user) throw httpError(404, 'User not found');
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw httpError(404, 'User not found');
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

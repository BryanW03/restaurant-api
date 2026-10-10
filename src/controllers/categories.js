const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const { pick, httpError } = require('../utils/helpers');

const FIELDS = ['name', 'description', 'active'];

exports.getAll = async (req, res, next) => {
  try {
    res.status(200).json(await Category.find().sort('name'));
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) throw httpError(404, 'Category not found');
    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const category = await Category.create(pick(req.body, FIELDS));
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, pick(req.body, FIELDS), {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!category) throw httpError(404, 'Category not found');
    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    if (await MenuItem.exists({ category: req.params.id })) {
      throw httpError(409, 'This category still has menu items. Delete or move them first.');
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw httpError(404, 'Category not found');
    res.status(200).json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};

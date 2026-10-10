const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const { pick, httpError } = require('../utils/helpers');

const FIELDS = ['name', 'description', 'price', 'category', 'available', 'preparationTime', 'ingredients'];

const checkCategory = async (categoryId) => {
  if (!(await Category.exists({ _id: categoryId }))) throw httpError(400, 'The category does not exist');
};

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.available !== undefined) filter.available = req.query.available === 'true';
    res.status(200).json(await MenuItem.find(filter).populate('category', 'name').sort('name'));
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('category', 'name');
    if (!item) throw httpError(404, 'Menu item not found');
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    await checkCategory(req.body.category);
    const item = await MenuItem.create(pick(req.body, FIELDS));
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    await checkCategory(req.body.category);
    const item = await MenuItem.findByIdAndUpdate(req.params.id, pick(req.body, FIELDS), {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!item) throw httpError(404, 'Menu item not found');
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) throw httpError(404, 'Menu item not found');
    res.status(200).json({ message: 'Menu item deleted' });
  } catch (err) {
    next(err);
  }
};

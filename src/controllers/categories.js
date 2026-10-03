const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const { pick, httpError, asyncHandler } = require('../utils/helpers');

const FIELDS = ['name', 'description', 'active'];

exports.getAll = asyncHandler(async (req, res) => {
  res.status(200).json(await Category.find().sort('name'));
});

exports.getOne = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw httpError(404, 'Category not found');
  res.status(200).json(category);
});

exports.create = asyncHandler(async (req, res) => {
  const category = await Category.create(pick(req.body, FIELDS));
  res.status(201).json(category);
});

exports.update = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, pick(req.body, FIELDS), {
    new: true,
    runValidators: true,
  });
  if (!category) throw httpError(404, 'Category not found');
  res.status(200).json(category);
});

exports.remove = asyncHandler(async (req, res) => {
  if (await MenuItem.exists({ category: req.params.id })) {
    throw httpError(409, 'This category still has menu items. Delete or move them first.');
  }
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw httpError(404, 'Category not found');
  res.status(200).json({ message: 'Category deleted' });
});

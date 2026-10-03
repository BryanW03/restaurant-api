const { body, param } = require('express-validator');

const idParam = param('id').isMongoId().withMessage('Invalid id format');

const categoryRules = [
  body('name').isString().trim().notEmpty().withMessage('name is required').isLength({ max: 50 }).withMessage('name must have at most 50 characters'),
  body('description').optional().isString().trim().isLength({ max: 200 }).withMessage('description must have at most 200 characters'),
  body('active').optional().isBoolean().withMessage('active must be true or false'),
];

const menuItemRules = [
  body('name').isString().trim().notEmpty().withMessage('name is required').isLength({ max: 80 }).withMessage('name must have at most 80 characters'),
  body('description').optional().isString().trim().isLength({ max: 300 }).withMessage('description must have at most 300 characters'),
  body('price').isFloat({ min: 0 }).withMessage('price must be a number greater than or equal to 0'),
  body('category').isMongoId().withMessage('category must be a valid category id'),
  body('available').optional().isBoolean().withMessage('available must be true or false'),
  body('preparationTime').optional().isInt({ min: 1, max: 240 }).withMessage('preparationTime must be between 1 and 240 minutes'),
  body('ingredients').optional().isArray().withMessage('ingredients must be an array of strings'),
  body('ingredients.*').optional().isString().withMessage('each ingredient must be a string'),
];

const userCreateRules = [
  body('username').isString().trim().notEmpty().withMessage('username is required').isLength({ max: 40 }).withMessage('username must have at most 40 characters'),
  body('displayName').optional().isString().trim().isLength({ max: 80 }),
  body('email').optional().isEmail().withMessage('email must be valid'),
  body('phone').optional().isString().trim().isLength({ max: 20 }).withMessage('phone must have at most 20 characters'),
  body('role').optional().isIn(['customer', 'staff', 'admin']).withMessage('role must be customer, staff or admin'),
  body('active').optional().isBoolean().withMessage('active must be true or false'),
];

const userUpdateRules = [
  body('username').optional().isString().trim().notEmpty().isLength({ max: 40 }),
  body('displayName').optional().isString().trim().isLength({ max: 80 }),
  body('email').optional().isEmail().withMessage('email must be valid'),
  body('phone').optional().isString().trim().isLength({ max: 20 }).withMessage('phone must have at most 20 characters'),
  body('role').optional().isIn(['customer', 'staff', 'admin']).withMessage('role must be customer, staff or admin'),
  body('active').optional().isBoolean().withMessage('active must be true or false'),
];

const orderItemsRules = (required) => {
  const items = body('items');
  return [
    (required ? items : items.optional()).isArray({ min: 1 }).withMessage('items must be a non-empty array'),
    body('items.*.menuItem').isMongoId().withMessage('each item needs a valid menuItem id'),
    body('items.*.quantity').isInt({ min: 1, max: 50 }).withMessage('quantity must be between 1 and 50'),
    body('items.*.notes').optional().isString().isLength({ max: 200 }).withMessage('item notes must have at most 200 characters'),
  ];
};

const orderCreateRules = [
  ...orderItemsRules(true),
  body('orderType').isIn(['dine-in', 'takeout', 'delivery']).withMessage('orderType must be dine-in, takeout or delivery'),
  body('tableNumber').optional().isInt({ min: 1 }).withMessage('tableNumber must be a positive integer'),
  body('notes').optional().isString().isLength({ max: 300 }).withMessage('notes must have at most 300 characters'),
];

const orderUpdateRules = [
  ...orderItemsRules(false),
  body('orderType').optional().isIn(['dine-in', 'takeout', 'delivery']).withMessage('orderType must be dine-in, takeout or delivery'),
  body('tableNumber').optional().isInt({ min: 1 }).withMessage('tableNumber must be a positive integer'),
  body('notes').optional().isString().isLength({ max: 300 }).withMessage('notes must have at most 300 characters'),
  body('status').optional().isIn(['pending', 'preparing', 'ready', 'delivered', 'cancelled']).withMessage('invalid status'),
];

module.exports = { idParam, categoryRules, menuItemRules, userCreateRules, userUpdateRules, orderCreateRules, orderUpdateRules };

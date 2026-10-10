const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { isStaff } = require('../middleware/auth');
const { pick, httpError } = require('../utils/helpers');

// Loads menu items, checks they exist and are available, and calculates the total.
const buildItems = async (items) => {
  const found = await MenuItem.find({ _id: { $in: items.map((i) => i.menuItem) } });
  const byId = new Map(found.map((m) => [m.id, m]));
  let total = 0;
  const result = items.map((i) => {
    const menuItem = byId.get(String(i.menuItem));
    if (!menuItem) throw httpError(400, `Menu item ${i.menuItem} does not exist`);
    if (!menuItem.available) throw httpError(400, `${menuItem.name} is not available right now`);
    total += menuItem.price * i.quantity;
    return { menuItem: menuItem._id, name: menuItem.name, quantity: i.quantity, unitPrice: menuItem.price, notes: i.notes };
  });
  return { items: result, total: Math.round(total * 100) / 100 };
};

const loadOrder = async (id) => {
  const order = await Order.findById(id);
  if (!order) throw httpError(404, 'Order not found');
  return order;
};

const ownsOrder = (order, user) => String(order.user) === user.id;

exports.getAll = async (req, res, next) => {
  try {
    const filter = isStaff(req.user) ? {} : { user: req.user._id };
    if (req.query.status) filter.status = req.query.status;
    const orders = await Order.find(filter).populate('user', 'username displayName').sort('-createdAt');
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const order = await loadOrder(req.params.id);
    if (!isStaff(req.user) && !ownsOrder(order, req.user)) throw httpError(403, 'This is not your order');
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { items, total } = await buildItems(req.body.items);
    const order = await Order.create({
      ...pick(req.body, ['orderType', 'tableNumber', 'notes']),
      user: req.user._id,
      items,
      total,
    });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const order = await loadOrder(req.params.id);
    const staff = isStaff(req.user);
    if (!staff && !ownsOrder(order, req.user)) throw httpError(403, 'This is not your order');

    if (!staff) {
      if (order.status !== 'pending') throw httpError(403, 'Only pending orders can be changed');
      if (req.body.status && req.body.status !== 'cancelled') {
        throw httpError(403, 'Customers can only cancel their orders');
      }
    }

    const changes = pick(req.body, ['orderType', 'tableNumber', 'notes', 'status']);
    if (req.body.items) Object.assign(changes, await buildItems(req.body.items));
    order.set(changes);
    await order.save();
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const order = await loadOrder(req.params.id);
    if (!isStaff(req.user)) {
      if (!ownsOrder(order, req.user)) throw httpError(403, 'This is not your order');
      if (order.status !== 'pending') throw httpError(403, 'Only pending orders can be deleted');
    }
    await order.deleteOne();
    res.status(200).json({ message: 'Order deleted' });
  } catch (err) {
    next(err);
  }
};

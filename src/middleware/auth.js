const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ message: 'You must be logged in. Use /auth/github to log in.' });
};

const requireRole = (...roles) => (req, res, next) => {
  if (!(req.isAuthenticated && req.isAuthenticated())) {
    return res.status(401).json({ message: 'You must be logged in. Use /auth/github to log in.' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You do not have permission to do this.' });
  }
  return next();
};

const isStaff = (user) => user.role === 'staff' || user.role === 'admin';

module.exports = { isAuthenticated, requireRole, isStaff };

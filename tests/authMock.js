// Test helper: replaces the real login check so tests can act as a customer, staff or admin
// without going through GitHub. It is only used inside the tests.
const actual = jest.requireActual('../src/middleware/auth');

const OBJECT_IDS = {
  admin: '65f1c2a4e1b2c3d4e5f60001',
  staff: '65f1c2a4e1b2c3d4e5f60002',
  customer: '65f1c2a4e1b2c3d4e5f60003',
};

let currentUser = null;

// __loginAs('admin' | 'staff' | 'customer') or __loginAs(null) to be logged out
const __loginAs = (role) => {
  currentUser = role ? { id: OBJECT_IDS[role], _id: OBJECT_IDS[role], role, username: `test-${role}` } : null;
};

const attach = (req) => {
  if (currentUser) {
    req.user = currentUser;
    req.isAuthenticated = () => true;
  }
};

const isAuthenticated = (req, res, next) => {
  attach(req);
  return actual.isAuthenticated(req, res, next);
};

const requireRole = (...roles) => (req, res, next) => {
  attach(req);
  return actual.requireRole(...roles)(req, res, next);
};

module.exports = { ...actual, isAuthenticated, requireRole, __loginAs, OBJECT_IDS };

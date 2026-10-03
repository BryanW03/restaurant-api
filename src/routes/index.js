const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).json({
    name: 'Restaurant Management API',
    docs: '/api-docs',
    login: '/auth/github',
    loggedIn: req.isAuthenticated(),
  });
});

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/categories', require('./categories'));
router.use('/menu-items', require('./menuItems'));
router.use('/orders', require('./orders'));

module.exports = router;

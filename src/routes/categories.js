const router = require('express').Router();
const c = require('../controllers/categories');
const { requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { idParam, categoryRules } = require('../validators');

router.get('/', c.getAll);
rt

module.exports = router;

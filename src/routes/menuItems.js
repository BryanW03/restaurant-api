const router = require('express').Router();
const c = require('../controllers/menuItems');
const { requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { idParam, menuItemRules } = require('../validators');

router.get('/', c.getAll);
router.get('/:id', idParam, validate, c.getOne);
router.post('/', requireRole('staff', 'admin'), menuItemRules, validate, c.create);
router.put('/:id', requireRole('staff', 'admin'), idParam, menuItemRules, validate, c.update);
router.delete('/:id', requireRole('staff', 'admin'), idParam, validate, c.remove);

module.exports = router;

const router = require('express').Router();
const c = require('../controllers/categories');
const { requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { idParam, categoryRules } = require('../validators');

router.get('/', c.getAll);
router.get('/:id', idParam, validate, c.getOne);
router.post('/', requireRole('staff', 'admin'), categoryRules, validate, c.create);
router.put('/:id', requireRole('staff', 'admin'), idParam, categoryRules, validate, c.update);
router.delete('/:id', requireRole('staff', 'admin'), idParam, validate, c.remove);

module.exports = router;

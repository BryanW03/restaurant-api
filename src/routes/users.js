const router = require('express').Router();
const c = require('../controllers/users');
const { isAuthenticated, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { idParam, userCreateRules, userUpdateRules } = require('../validators');

router.get('/', requireRole('staff', 'admin'), c.getAll);
router.get('/:id', isAuthenticated, idParam, validate, c.getOne);
router.post('/', requireRole('admin'), userCreateRules, validate, c.create);
router.put('/:id', isAuthenticated, idParam, userUpdateRules, validate, c.update);
router.delete('/:id', requireRole('admin'), idParam, validate, c.remove);

module.exports = router;

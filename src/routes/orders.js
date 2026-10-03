const router = require('express').Router();
const c = require('../controllers/orders');
const { isAuthenticated } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { idParam, orderCreateRules, orderUpdateRules } = require('../validators');

router.use(isAuthenticated);

router.get('/', c.getAll);
router.get('/:id', idParam, validate, c.getOne);
router.post('/', orderCreateRules, validate, c.create);
router.put('/:id', idParam, orderUpdateRules, validate, c.update);
router.delete('/:id', idParam, validate, c.remove);

module.exports = router;


var express = require('express'),
    router = express.Router();

const ctrl = require('../controllers/user.controller');

// BASE = /api/v1/users

router.route('/')
  .get(ctrl.list)
  .post(ctrl.create)

router.route('/:id')
  .get(ctrl.read)
  .delete(ctrl.delete)

  
router.route('/login')
  .put(ctrl.check)

module.exports = router;

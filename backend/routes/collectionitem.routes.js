
var express = require('express'),
    router = express.Router();

const ctrl = require('../controllers/collectionitem.controller');

// BASE = /api/v1/collectionitems

router.route('/')
  .get(ctrl.list)
  .post(ctrl.create)

router.route('/id/:id')
  .get(ctrl.read)
  .delete(ctrl.delete)

router.route('/watched')
  .get(ctrl.watched)

router.route('/updatelist')
  .post(ctrl.updateList)

module.exports = router;

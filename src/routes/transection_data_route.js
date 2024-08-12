const express = require('express');
// const session = require('express-session')

const TransectionController = require('../controllers/transection_data_controller');

const router = express.Router();

router.get(
  '/',
  TransectionController.get,
);
router.post(
  '/add',
  TransectionController.add,
);
router.patch(
  '/edit',
  TransectionController.edit,
);
router.post(
  '/export',
  TransectionController.export2Excel,
);

module.exports = router;

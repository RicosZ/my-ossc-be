const express = require('express');

const Reportdashboard = require('../controllers/report-controllers');

const router = express.Router();

router.get(
  '/reportdashboard',
  Reportdashboard.getDashboard,
);

module.exports = router;

const express = require('express');
// const session = require('express-session')

const AuthController = require('../controllers/auth_controller');

const router = express.Router();

router.post(
  '/login',
  AuthController.login,
);

module.exports = router;

const express = require('express');
const router = express.Router();
const signupController = require('../Controllers/loginController');

router.route('/').post(signupController.login);
module.exports = router;

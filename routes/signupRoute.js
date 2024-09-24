const express = require('express');
const signupController = require('../Controllers/signupController');
const router = express.Router();

router.route('/').post(signupController.signup);

module.exports = router;

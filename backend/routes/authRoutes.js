const express = require('express');
// Expose the public account registration and login endpoints.
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;

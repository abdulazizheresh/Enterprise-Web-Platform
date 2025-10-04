const express = require('express');
const { register, login, setupMFA, verifyMFA } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { registerValidation, loginValidation, validate } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', authLimiter, registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);
router.post('/mfa/setup', auth, setupMFA);
router.post('/mfa/verify', auth, verifyMFA);

module.exports = router;
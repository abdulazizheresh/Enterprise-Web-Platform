const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const { profileUpdateValidation, validate } = require('../middleware/validation');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/profile', auth, apiLimiter, getProfile);
router.put('/profile', auth, profileUpdateValidation, validate, updateProfile);

module.exports = router;
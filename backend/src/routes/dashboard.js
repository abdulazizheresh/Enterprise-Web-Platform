const express = require('express');
const { getStats, getCharts, getRealtime, getHealth } = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/stats', auth, apiLimiter, getStats);
router.get('/charts', auth, apiLimiter, getCharts);
router.get('/realtime', auth, apiLimiter, getRealtime);
router.get('/health', auth, apiLimiter, getHealth);


module.exports = router;
const express = require('express');
const { auth } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const logger = require('../utils/logger');

const router = express.Router();

// Get user notifications
router.get('/', auth, apiLimiter, async (req, res) => {
    try {
        // Mock notifications for demo
        const notifications = [
            {
                id: 1,
                title: 'Welcome!',
                message: 'Welcome to Enterprise Platform',
                type: 'info',
                read: false,
                createdAt: new Date()
            },
            {
                id: 2,
                title: 'Security Alert',
                message: 'New login detected',
                type: 'warning',
                read: true,
                createdAt: new Date(Date.now() - 86400000)
            }
        ];

        res.json({ notifications });
    } catch (error) {
        logger.error('Get notifications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Mark notification as read
router.put('/:id/read', auth, apiLimiter, async (req, res) => {
    try {
        const { id } = req.params;
        // Mock response
        res.json({ message: 'Notification marked as read', id });
    } catch (error) {
        logger.error('Mark notification read error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
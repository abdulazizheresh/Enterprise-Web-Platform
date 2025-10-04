const User = require('../models/user');
const logger = require('../utils/logger');

const getProfile = async (req, res) => {
    try {
        const redisClient = require('../config/redis');
        const cacheKey = `user:profile:${req.userId}`;

        // Try cache first
        if (redisClient && redisClient.isOpen) {
            const cached = await redisClient.get(cacheKey);
            if (cached) {
                logger.info('Profile loaded from cache');
                return res.json(JSON.parse(cached));
            }
        }

        const user = await User.findByPk(req.userId, {
            attributes: { exclude: ['password', 'mfaSecret'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const result = { user };

        // Cache for 30 minutes
        if (redisClient && redisClient.isOpen) {
            await redisClient.setEx(cacheKey, 1800, JSON.stringify(result));
            logger.info('Profile cached');
        }

        res.json(result);

    } catch (error) {
        logger.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update({ name, email });

        // Clear all user-related caches
        const redisClient = require('../config/redis');
        if (redisClient && redisClient.isOpen) {
            await redisClient.del(`user:profile:${req.userId}`);
            await redisClient.del(`user:${req.userId}`);
            logger.info('User caches cleared after profile update');
        }

        res.json({
            message: 'Profile updated successfully',
            user: user.toJSON()
        });

    } catch (error) {
        logger.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getProfile, updateProfile };
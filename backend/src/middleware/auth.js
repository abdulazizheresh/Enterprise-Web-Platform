const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.userId);

        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.userId = user.id;
        req.user = user;
        next();

    } catch (error) {
        logger.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        await auth(req, res, () => {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Admin access required' });
            }
            next();
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = { auth, adminAuth };
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/user');
const logger = require('../utils/logger');

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
    try {
        const { username, email, name, password } = req.body;

        const existingUser = await User.findOne({
            where: {
                [User.sequelize.Sequelize.Op.or]: [{ email }, { username }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ username, email, name, password });
        const token = generateToken(user.id);

        // Cache user data for 1 hour
        const redisClient = require('../config/redis');
        if (redisClient && redisClient.isOpen) {
            const userData = user.toJSON();
            await redisClient.setEx(
                `user:${user.id}`,
                3600,
                JSON.stringify(userData)
            );
            logger.info('User data cached after registration');
        }

        logger.info(`New user registered: ${user.email}`);

        res.status(201).json({
            message: 'User created successfully',
            token,
            user
        });

    } catch (error) {
        logger.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password, mfaToken } = req.body;
        const redisClient = require('../config/redis');

        // Check failed login attempts (simple rate limiting)
        if (redisClient && redisClient.isOpen) {
            const attempts = await redisClient.get(`login:attempts:${username}`);
            if (attempts && parseInt(attempts) >= 5) {
                return res.status(429).json({ 
                    message: 'Too many failed attempts. Try again in 15 minutes.' 
                });
            }
        }

        const user = await User.findOne({
            where: {
                [User.sequelize.Sequelize.Op.or]: [{ email: username }, { username }]
            }
        });

        if (!user || !await user.validatePassword(password)) {
            // Track failed attempts
            if (redisClient && redisClient.isOpen) {
                await redisClient.incr(`login:attempts:${username}`);
                await redisClient.expire(`login:attempts:${username}`, 900); // 15 min
            }
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.mfaEnabled) {
            if (!mfaToken) {
                return res.status(200).json({ requiresMFA: true });
            }

            const verified = speakeasy.totp.verify({
                secret: user.mfaSecret,
                encoding: 'base32',
                token: mfaToken,
                window: 2
            });

            if (!verified) {
                return res.status(401).json({ message: 'Invalid MFA token' });
            }
        }

        await user.update({ lastLogin: new Date() });
        const token = generateToken(user.id);

        // Clear failed attempts on successful login
        if (redisClient && redisClient.isOpen) {
            await redisClient.del(`login:attempts:${username}`);
            
            // Cache active session
            await redisClient.setEx(
                `session:${user.id}`,
                604800, // 7 days (same as JWT)
                token
            );
            
            // Cache user data
            const userData = user.toJSON();
            await redisClient.setEx(
                `user:${user.id}`,
                3600, // 1 hour
                JSON.stringify(userData)
            );
            
            logger.info('User session cached');
        }

        logger.info(`User logged in: ${user.email}`);

        res.json({ message: 'Login successful', token, user });

    } catch (error) {
        logger.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const setupMFA = async (req, res) => {
    try {
        const redisClient = require('../config/redis');
        let user;

        // Try to get user from cache first
        if (redisClient && redisClient.isOpen) {
            const cached = await redisClient.get(`user:${req.userId}`);
            if (cached) {
                user = JSON.parse(cached);
                // Get full user object from DB for update
                user = await User.findByPk(req.userId);
            }
        }

        if (!user) {
            user = await User.findByPk(req.userId);
        }

        const secret = speakeasy.generateSecret({
            name: `Enterprise Platform (${user.email})`,
            issuer: 'Enterprise Platform'
        });

        await user.update({ mfaSecret: secret.base32 });
        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

        // Clear user cache to refresh data
        if (redisClient && redisClient.isOpen) {
            await redisClient.del(`user:${user.id}`);
        }

        res.json({ secret: secret.base32, qrCode: qrCodeUrl });

    } catch (error) {
        logger.error('MFA setup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const verifyMFA = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findByPk(req.userId);

        const verified = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token,
            window: 2
        });

        if (verified) {
            await user.update({ mfaEnabled: true });
            
            // Clear user cache
            const redisClient = require('../config/redis');
            if (redisClient && redisClient.isOpen) {
                await redisClient.del(`user:${user.id}`);
                logger.info('User cache cleared after MFA enable');
            }
            
            res.json({ message: 'MFA enabled successfully' });
        } else {
            res.status(400).json({ message: 'Invalid token' });
        }

    } catch (error) {
        logger.error('MFA verification error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login, setupMFA, verifyMFA };
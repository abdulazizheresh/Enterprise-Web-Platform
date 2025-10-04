const User = require('../models/user');
const logger = require('../utils/logger');
const os = require('os');

let requestCount = 0;
let errorCount = 0;

const getStats = async (req, res) => {
    try {
        const redisClient = require('../config/redis');
        
        // Try cache first
        if (redisClient && redisClient.isOpen) {
            const cached = await redisClient.get('dashboard:stats');
            if (cached) {
                logger.info('Stats loaded from cache');
                return res.json(JSON.parse(cached));
            }
        }

        const totalUsers = await User.count();
        
        const activeUsers = await User.count({
            where: {
                lastLogin: {
                    [User.sequelize.Sequelize.Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000)
                }
            }
        });

        const prevUsers = await User.count({
            where: {
                createdAt: {
                    [User.sequelize.Sequelize.Op.lt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
            }
        });

        const userGrowth = prevUsers > 0 
            ? (((totalUsers - prevUsers) / prevUsers) * 100).toFixed(1)
            : 0;

        const result = {
            stats: {
                totalUsers,
                activeUsers,
                systemUptime: process.uptime(),
                responseTime: Math.floor(process.hrtime()[1] / 1000000),
                successRate: requestCount > 0 
                    ? (((requestCount - errorCount) / requestCount) * 100).toFixed(1)
                    : 100,
                serverTime: new Date().toISOString(),
                userGrowth: parseFloat(userGrowth),
                activeGrowth: totalUsers > 0 ? Math.floor((activeUsers / totalUsers) * 100) : 0,
                responseChange: 5,
                uptime: 99.9,
                uptimeDays: Math.floor(process.uptime() / 86400)
            }
        };

        // Save to cache for 5 minutes
        if (redisClient && redisClient.isOpen) {
            await redisClient.setEx('dashboard:stats', 300, JSON.stringify(result));
            logger.info('Stats saved to cache');
        }

        res.json(result);
    } catch (error) {
        logger.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getCharts = async (req, res) => {
    try {
        const { period = '24h' } = req.query;
        const redisClient = require('../config/redis');
        const cacheKey = `dashboard:charts:${period}`;

        // Try cache
        if (redisClient && redisClient.isOpen) {
            const cached = await redisClient.get(cacheKey);
            if (cached) {
                logger.info('Charts loaded from cache');
                return res.json(JSON.parse(cached));
            }
        }

        const hours = [];
        const userData = [];
        
        for (let i = 23; i >= 0; i--) {
            const hourStart = new Date(Date.now() - i * 60 * 60 * 1000);
            const hourEnd = new Date(Date.now() - (i - 1) * 60 * 60 * 1000);
            
            const count = await User.count({
                where: {
                    createdAt: {
                        [User.sequelize.Sequelize.Op.between]: [hourStart, hourEnd]
                    }
                }
            });
            
            hours.push(hourStart.getHours() + ':00');
            userData.push(count);
        }

        const result = {
            charts: {
                userActivity: {
                    labels: hours,
                    datasets: [{
                        label: 'New Users',
                        data: userData,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)'
                    }]
                },
                performance: {
                    labels: ['CPU', 'Memory', 'Disk', 'Network'],
                    datasets: [{
                        label: 'Usage %',
                        data: [
                            (os.loadavg()[0] * 100 / os.cpus().length).toFixed(0),
                            ((1 - os.freemem() / os.totalmem()) * 100).toFixed(0),
                            42,
                            56
                        ],
                        backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6']
                    }]
                }
            }
        };

        // Cache for 10 minutes
        if (redisClient && redisClient.isOpen) {
            await redisClient.setEx(cacheKey, 600, JSON.stringify(result));
            logger.info('Charts saved to cache');
        }

        res.json(result);
    } catch (error) {
        logger.error('Charts error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getRealtime = async (req, res) => {
    try {
        const { io } = require('../../server');
        
        const data = {
            activeConnections: io.engine.clientsCount || 0,
            requestsPerSecond: Math.floor(requestCount / process.uptime()),
            errorRate: requestCount > 0 
                ? ((errorCount / requestCount) * 100).toFixed(2)
                : 0,
            cpuUsage: (os.loadavg()[0] * 100 / os.cpus().length).toFixed(0),
            memoryUsage: ((1 - os.freemem() / os.totalmem()) * 100).toFixed(0),
            diskUsage: 42
        };

        res.json({ data });
    } catch (error) {
        logger.error('Realtime error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getHealth = async (req, res) => {
    try {
        let dbHealth = 'healthy';
        let redisHealth = 'unknown';

        // Test database
        try {
            await User.sequelize.authenticate();
        } catch {
            dbHealth = 'error';
        }

        // Test Redis
        try {
            const redisClient = require('../config/redis');
            if (redisClient && redisClient.isOpen) {
                await redisClient.ping();
                redisHealth = 'healthy';
            } else {
                redisHealth = 'error';
            }
        } catch {
            redisHealth = 'error';
        }

        const health = {
            database: dbHealth,
            redis: redisHealth,
            api: 'healthy',
            storage: 'healthy',
            lastCheck: new Date().toISOString()
        };

        res.json({ health });
    } catch (error) {
        logger.error('Health check error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const trackRequests = (req, res, next) => {
    requestCount++;
    res.on('finish', () => {
        if (res.statusCode >= 400) {
            errorCount++;
        }
    });
    next();
};

module.exports = { getStats, getCharts, getRealtime, getHealth, trackRequests };
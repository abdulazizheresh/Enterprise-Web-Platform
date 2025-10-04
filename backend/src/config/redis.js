const redis = require('redis');
const logger = require('../utils/logger');

let client = null;

const connectRedis = async () => {
    try {
        client = redis.createClient({
            url: process.env.REDIS_URL,
            socket: {
                tls: true,
                rejectUnauthorized: false
            }
        });

        client.on('error', (err) => {
            logger.error('Redis Client Error:', err);
        });

        client.on('connect', () => {
            logger.info('Redis connected successfully');
        });

        client.on('ready', () => {
            logger.info('Redis ready to use');
        });

        await client.connect();

    } catch (error) {
        logger.error('Redis connection failed:', error);
        client = null;
    }
};

connectRedis();

module.exports = client;
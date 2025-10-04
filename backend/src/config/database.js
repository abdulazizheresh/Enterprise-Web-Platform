// src/config/database.js
const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'enterprise_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'root',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
    }
);

// Test connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        logger.info('Database connected successfully');
    } catch (error) {
        logger.error('Database connection failed:', error);
    }
};

testConnection();

module.exports = { sequelize, Sequelize };
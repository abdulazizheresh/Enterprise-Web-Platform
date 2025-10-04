const crypto = require('crypto');

const generateRandomString = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
};

const generateCorrelationId = () => {
    return crypto.randomUUID();
};

const hashData = (data) => {
    return crypto.createHash('sha256').update(data).digest('hex');
};

module.exports = {
    generateRandomString,
    formatDate,
    validateEmail,
    sanitizeInput,
    generateCorrelationId,
    hashData
};
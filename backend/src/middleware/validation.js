const { body, validationResult } = require('express-validator');

const registerValidation = [
    body('username')
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be 3-50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscore'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email required'),
    body('name')
        .isLength({ min: 2, max: 100 })
        .trim()
        .withMessage('Name must be 2-100 characters'),
    body('password')
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least 8 characters, one uppercase, one lowercase, and one number')
];

const loginValidation = [
    body('username').notEmpty().withMessage('Username required'),
    body('password').notEmpty().withMessage('Password required')
];

const profileUpdateValidation = [
    body('name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .trim()
        .withMessage('Name must be 2-100 characters'),
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email required')
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    registerValidation,
    loginValidation,
    profileUpdateValidation,
    validate
};
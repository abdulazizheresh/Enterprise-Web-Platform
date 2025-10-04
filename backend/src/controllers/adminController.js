// src/controllers/adminController.js
const User = require('../models/user');
const logger = require('../utils/logger');

const getUsers = async (req, res) => {
    try {
        const { search, role, status, page = 1, limit = 10 } = req.query;

        const where = {};

        if (search) {
            where[User.sequelize.Sequelize.Op.or] = [
                { name: { [User.sequelize.Sequelize.Op.like]: `%${search}%` } },
                { email: { [User.sequelize.Sequelize.Op.like]: `%${search}%` } },
                { username: { [User.sequelize.Sequelize.Op.like]: `%${search}%` } }
            ];
        }

        if (role) where.role = role;
        if (status) where.isActive = status === 'active';

        const offset = (page - 1) * limit;

        const { count, rows } = await User.findAndCountAll({
            where,
            attributes: { exclude: ['password', 'mfaSecret'] },
            limit: parseInt(limit),
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            users: rows,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        logger.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createUser = async (req, res) => {
    try {
        const { username, email, name, password, role } = req.body;

        const user = await User.create({
            username,
            email,
            name,
            password,
            role: role || 'user'
        });

        res.status(201).json({ message: 'User created', user: user.toJSON() });
    } catch (error) {
        logger.error('Create user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, isActive } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update({ name, email, role, isActive });

        res.json({ message: 'User updated', user: user.toJSON() });
    } catch (error) {
        logger.error('Update user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();

        res.json({ message: 'User deleted' });
    } catch (error) {
        logger.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update({ isActive: !user.isActive });

        res.json({ message: 'Status updated', user: user.toJSON() });
    } catch (error) {
        logger.error('Toggle status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: { exclude: ['password', 'mfaSecret'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        logger.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus
};
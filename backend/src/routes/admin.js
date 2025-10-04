// src/routes/admin.js
const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus
} = require('../controllers/adminController');

const router = express.Router();

// All routes require admin auth
router.use(adminAuth);

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/status', toggleUserStatus);

module.exports = router;
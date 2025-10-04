require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const logger = require('./src/utils/logger');

// Import models
// const User = require('./src/models/user');

// Import routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');
const dashboardRoutes = require('./src/routes/dashboard');
const notificationRoutes = require('./src/routes/notifications');
const adminRoutes = require('./src/routes/admin');

const app = express();
const server = createServer(app);

const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://4.248.248.213/';

const io = new Server(server, {
    cors: { origin: FRONTEND_ORIGIN, methods: ['GET', 'POST'] }
});

// middlewares
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const { trackRequests } = require('./src/controllers/dashboardController');
app.use(trackRequests);

// logging
app.use((req, res, next) => { 
    logger.info(`${req.method} ${req.path} - ${req.ip}`); 
    next(); 
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.json({ status: 'Backend running', service: 'enterprise-backend' });
});

// health
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(), 
        uptime: process.uptime(), 
        environment: process.env.NODE_ENV || 'development' 
    });
});

// sockets
io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);
    socket.on('join-room', (userId) => socket.join(`user_${userId}`));
    socket.on('disconnect', () => logger.info(`User disconnected: ${socket.id}`));
});

// errors
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!', 
        error: process.env.NODE_ENV === 'development' ? err.message : {} 
    });
});

// Database sync - إنشاء الجداول تلقائياً
// const syncDatabase = async () => {
//     try {
//         await User.sync({ force: false });
//         logger.info('Database tables synced successfully');
//     } catch (error) {
//         logger.error('Database sync failed:', error);
//     }
// };

// start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
    logger.info(`Server running on ${PORT}`);
    // await syncDatabase();
});

module.exports = { app, io };
const logger = require('../utils/logger');

class SocketService {
    constructor(io) {
        this.io = io;
        this.connectedUsers = new Map();
    }

    init() {
        this.io.on('connection', (socket) => {
            logger.info(`Socket connected: ${socket.id}`);

            socket.on('join-user-room', (userId) => {
                socket.join(`user_${userId}`);
                this.connectedUsers.set(userId, socket.id);
                logger.info(`User ${userId} joined their room`);
            });

            socket.on('disconnect', () => {
                // Find user by socket id and remove from connected users
                for (let [userId, socketId] of this.connectedUsers) {
                    if (socketId === socket.id) {
                        this.connectedUsers.delete(userId);
                        break;
                    }
                }
                logger.info(`Socket disconnected: ${socket.id}`);
            });
        });
    }

    sendNotificationToUser(userId, notification) {
        this.io.to(`user_${userId}`).emit('notification', notification);
    }

    sendToAllUsers(event, data) {
        this.io.emit(event, data);
    }

    isUserOnline(userId) {
        return this.connectedUsers.has(userId);
    }

    getOnlineUsersCount() {
        return this.connectedUsers.size;
    }
}

module.exports = SocketService;
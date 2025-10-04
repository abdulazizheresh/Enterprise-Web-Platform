import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
    this.connected = false
    this.eventListeners = new Map()
  }

  connect(token, options = {}) {
    const defaultOptions = {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    }

    const socketOptions = { ...defaultOptions, ...options }
    const serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://4.248.248.213'

    this.socket = io(serverUrl, socketOptions)
    this.setupDefaultHandlers()

    return this.socket
  }

  setupDefaultHandlers() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      this.connected = true
      console.log('Socket connected:', this.socket.id)
    })

    this.socket.on('disconnect', (reason) => {
      this.connected = false
      console.log('Socket disconnected:', reason)
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts')
    })

    this.socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.connected = false
      this.eventListeners.clear()
    }
  }

  emit(event, data) {
    if (this.socket && this.connected) {
      this.socket.emit(event, data)
    } else {
      console.warn('Cannot emit: socket not connected')
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback)

      // Store callback for cleanup
      if (!this.eventListeners.has(event)) {
        this.eventListeners.set(event, [])
      }
      this.eventListeners.get(event).push(callback)
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback)

      // Remove from stored callbacks
      if (this.eventListeners.has(event)) {
        const callbacks = this.eventListeners.get(event)
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  // User-specific methods
  joinUserRoom(userId) {
    this.emit('join-user-room', userId)
  }

  leaveUserRoom(userId) {
    this.emit('leave-user-room', userId)
  }

  // Room management
  joinRoom(roomId) {
    this.emit('join-room', roomId)
  }

  leaveRoom(roomId) {
    this.emit('leave-room', roomId)
  }

  // Messaging
  sendMessage(message) {
    this.emit('message', message)
  }

  // Status updates
  updateUserStatus(status) {
    this.emit('user-status', status)
  }

  // Notifications
  markNotificationRead(notificationId) {
    this.emit('notification-read', notificationId)
  }

  // Dashboard events
  requestRealtimeData() {
    this.emit('request-realtime-data')
  }

  subscribeToStats() {
    this.emit('subscribe-stats')
  }

  unsubscribeFromStats() {
    this.emit('unsubscribe-stats')
  }

  // Health monitoring
  ping() {
    return new Promise((resolve) => {
      const startTime = Date.now()
      this.socket.emit('ping', startTime)

      this.socket.once('pong', (timestamp) => {
        const latency = Date.now() - timestamp
        resolve(latency)
      })
    })
  }

  // Utility methods
  isConnected() {
    return this.connected && this.socket?.connected
  }

  getSocketId() {
    return this.socket?.id
  }

  cleanup() {
    // Remove all custom event listeners
    this.eventListeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.socket?.off(event, callback)
      })
    })
    this.eventListeners.clear()
  }
}

// Export singleton instance
export default new SocketService()

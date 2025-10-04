import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import io from 'socket.io-client'
import { useAuthStore } from './auth'
import { useNotificationsStore } from './notifications'

export const useSocketStore = defineStore('socket', () => {
  // State
  const socket = ref(null)
  const isConnected = ref(false)
  const connectionError = ref(null)
  const onlineUsers = ref(0)
  const events = ref([])

  // Getters
  const connectionStatus = computed(() => {
    if (isConnected.value) return 'connected'
    if (connectionError.value) return 'error'
    return 'disconnected'
  })

  // Actions
  const connect = () => {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) {
      console.warn('Cannot connect socket: user not authenticated')
      return
    }

    socket.value = io(import.meta.env.VITE_SOCKET_URL || 'http://4.248.248.213', {
      auth: {
        token: authStore.token
      },
      transports: ['websocket', 'polling']
    })

    setupEventListeners()
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
    }
    isConnected.value = false
    connectionError.value = null
  }

  const setupEventListeners = () => {
    if (!socket.value) return

    const authStore = useAuthStore()
    const notificationsStore = useNotificationsStore()

    // Connection events
    socket.value.on('connect', () => {
      isConnected.value = true
      connectionError.value = null

      // Join user room
      if (authStore.user?.id) {
        socket.value.emit('join-user-room', authStore.user.id)
      }

      addEvent('Connected to server')
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
      addEvent('Disconnected from server')
    })

    socket.value.on('connect_error', (error) => {
      connectionError.value = error.message
      addEvent(`Connection error: ${error.message}`)
    })

    // Notification events
    socket.value.on('notification', (notification) => {
      notificationsStore.addNotification(notification)
      addEvent(`New notification: ${notification.title}`)
    })

    // Real-time updates
    socket.value.on('user-count-update', (count) => {
      onlineUsers.value = count
    })

    socket.value.on('system-alert', (alert) => {
      notificationsStore.addNotification({
        type: 'warning',
        title: 'System Alert',
        message: alert.message,
        priority: 'high'
      })
      addEvent(`System alert: ${alert.message}`)
    })

    // Dashboard updates
    socket.value.on('stats-update', () => {
      // Could emit to dashboard store
      addEvent('Dashboard stats updated')
    })

    // User activity events
    socket.value.on('user-activity', (activity) => {
      addEvent(`User activity: ${activity.type}`)
    })
  }

  const emit = (event, data) => {
    if (socket.value && isConnected.value) {
      socket.value.emit(event, data)
      addEvent(`Emitted: ${event}`)
    } else {
      console.warn('Cannot emit: socket not connected')
    }
  }

  const addEvent = (message) => {
    events.value.unshift({
      id: Date.now(),
      message,
      timestamp: new Date()
    })

    // Keep only last 100 events
    if (events.value.length > 100) {
      events.value = events.value.slice(0, 100)
    }
  }

  const clearEvents = () => {
    events.value = []
  }

  // Specific emit methods
  const joinRoom = (roomId) => {
    emit('join-room', roomId)
  }

  const leaveRoom = (roomId) => {
    emit('leave-room', roomId)
  }

  const sendMessage = (message) => {
    emit('message', message)
  }

  const updateStatus = (status) => {
    emit('status-update', status)
  }

  return {
    // State
    socket,
    isConnected,
    connectionError,
    onlineUsers,
    events,

    // Getters
    connectionStatus,

    // Actions
    connect,
    disconnect,
    emit,
    addEvent,
    clearEvents,
    joinRoom,
    leaveRoom,
    sendMessage,
    updateStatus
  }
})

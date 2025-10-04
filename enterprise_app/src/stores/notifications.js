import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import notificationService from '@/services/notification.service'

export const useNotificationsStore = defineStore('notifications', () => {
  // State
  const notifications = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const unreadCount = computed(() =>
    notifications.value.filter(n => !n.read).length
  )

  const recentNotifications = computed(() =>
    notifications.value.slice(0, 5)
  )

  const notificationsByType = computed(() => {
    return notifications.value.reduce((acc, notification) => {
      const type = notification.type || 'info'
      if (!acc[type]) acc[type] = []
      acc[type].push(notification)
      return acc
    }, {})
  })

  // Actions
  const fetchNotifications = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await notificationService.getNotifications()
      notifications.value = response.notifications
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      const notification = notifications.value.find(n => n.id === id)
      if (notification) {
        notification.read = true
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const markAllAsRead = async () => {
    isLoading.value = true
    try {
      await notificationService.markAllAsRead()
      notifications.value.forEach(n => n.read = true)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id)
      const index = notifications.value.findIndex(n => n.id === id)
      if (index > -1) {
        notifications.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const addNotification = (notification) => {
    notifications.value.unshift({
      id: Date.now(),
      read: false,
      createdAt: new Date(),
      ...notification
    })
  }

  const clearAll = async () => {
    isLoading.value = true
    try {
      await notificationService.clearAll()
      notifications.value = []
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    notifications,
    isLoading,
    error,

    // Getters
    unreadCount,
    recentNotifications,
    notificationsByType,

    // Actions
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    clearAll,
    clearError
  }
})

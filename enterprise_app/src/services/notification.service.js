import api from './api'

const notificationService = {
  // Get all notifications
  async getNotifications(limit = 50, offset = 0) {
    return await api.get(`/notifications?limit=${limit}&offset=${offset}`)
  },

  // Mark notification as read
  async markAsRead(id) {
    return await api.patch(`/notifications/${id}/read`)
  },

  // Mark all notifications as read
  async markAllAsRead() {
    return await api.patch('/notifications/read-all')
  },

  // Delete notification
  async deleteNotification(id) {
    return await api.delete(`/notifications/${id}`)
  },

  // Clear all notifications
  async clearAll() {
    return await api.delete('/notifications')
  },

  // Get notification preferences
  async getPreferences() {
    return await api.get('/notifications/preferences')
  },

  // Update notification preferences
  async updatePreferences(preferences) {
    return await api.put('/notifications/preferences', preferences)
  }
}

export default notificationService

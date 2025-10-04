import api from './api'

const userService = {
  // Get user profile
  async getProfile() {
    return await api.get('/user/profile')
  },

  // Update user profile
  async updateProfile(data) {
    return await api.put('/user/profile', data)
  },

  // Upload avatar
  async uploadAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)

    return await api.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Update preferences
  async updatePreferences(preferences) {
    return await api.put('/user/preferences', preferences)
  },

  // Get activity log
  async getActivityLog(limit = 50) {
    return await api.get(`/user/activity?limit=${limit}`)
  },

  // Change password
  async changePassword(data) {
    return await api.post('/user/password/change', data)
  },

  // Enable MFA
  async enableMFA() {
    return await api.post('/user/mfa/enable')
  },

  // Disable MFA
  async disableMFA(password) {
    return await api.post('/user/mfa/disable', { password })
  },

  // Delete account
  async deleteAccount(password) {
    return await api.delete('/user/account', { data: { password } })
  },

  // Get user settings
  async getSettings() {
    return await api.get('/user/settings')
  },

  // Update user settings
  async updateSettings(settings) {
    return await api.put('/user/settings', settings)
  }
}

export default userService

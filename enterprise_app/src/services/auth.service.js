import api from './api'

const authService = {
  // Login user
  async login(credentials) {
    return await api.post('/auth/login', credentials)
  },

  // Register user
  async register(userData) {
    return await api.post('/auth/register', userData)
  },

  // Logout user
  async logout() {
    return await api.post('/auth/logout')
  },

  // Get user profile
  async getProfile() {
    return await api.get('/user/profile')
  },

  // Update profile
  async updateProfile(data) {
    return await api.put('/user/profile', data)
  },

  // Setup MFA
  async setupMFA() {
    return await api.post('/auth/mfa/setup')
  },

  // Verify MFA
  async verifyMFA(token) {
    return await api.post('/auth/mfa/verify', { token })
  },

  // Refresh token
  async refreshToken() {
    return await api.post('/auth/refresh')
  },

  // Request password reset
  async requestPasswordReset(email) {
    return await api.post('/auth/password/reset', { email })
  },

  // Reset password
  async resetPassword(token, password) {
    return await api.post('/auth/password/reset/confirm', { token, password })
  },

  // Verify email
  async verifyEmail(token) {
    return await api.post('/auth/email/verify', { token })
  },

  // Resend verification email
  async resendVerificationEmail() {
    return await api.post('/auth/email/resend')
  }
}

export default authService

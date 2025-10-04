// src/services/admin.service.js
import api from './api'

const adminService = {
  // Get all users
  async getUsers(params = {}) {
    const query = new URLSearchParams(params).toString()
    return await api.get(`/admin/users?${query}`)
  },

  // Get user by ID
  async getUser(id) {
    return await api.get(`/admin/users/${id}`)
  },

  // Create user
  async createUser(userData) {
    return await api.post('/admin/users', userData)
  },

  // Update user
  async updateUser(id, userData) {
    return await api.put(`/admin/users/${id}`, userData)
  },

  // Delete user
  async deleteUser(id) {
    return await api.delete(`/admin/users/${id}`)
  },

  // Toggle user status
  async toggleUserStatus(id) {
    return await api.patch(`/admin/users/${id}/status`)
  }
}

export default adminService

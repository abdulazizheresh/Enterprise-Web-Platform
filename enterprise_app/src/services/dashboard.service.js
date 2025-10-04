import api from './api'

const dashboardService = {
  // Get dashboard stats
  async getStats() {
    return await api.get('/dashboard/stats')
  },

  // Get chart data
  async getChartData(period = '24h') {
    return await api.get(`/dashboard/charts?period=${period}`)
  },

  // Get realtime data
  async getRealtimeData() {
    return await api.get('/dashboard/realtime')
  },

  // Get system health
  async getSystemHealth() {
    return await api.get('/dashboard/health')
  },

  // Get user analytics
  async getUserAnalytics(period = '7d') {
    return await api.get(`/dashboard/analytics/users?period=${period}`)
  },

  // Get performance metrics
  async getPerformanceMetrics(period = '24h') {
    return await api.get(`/dashboard/metrics/performance?period=${period}`)
  },

  // Get traffic analytics
  async getTrafficAnalytics(period = '24h') {
    return await api.get(`/dashboard/analytics/traffic?period=${period}`)
  },

  // Get error logs
  async getErrorLogs(limit = 50) {
    return await api.get(`/dashboard/logs/errors?limit=${limit}`)
  },

  // Get server metrics
  async getServerMetrics() {
    return await api.get('/dashboard/metrics/server')
  }
}

export default dashboardService

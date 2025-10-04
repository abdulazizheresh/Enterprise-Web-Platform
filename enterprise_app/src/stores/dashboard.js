import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dashboardService from '@/services/dashboard.service'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const stats = ref({
    totalUsers: 0,
    activeUsers: 0,
    systemUptime: 0,
    responseTime: 0,
    successRate: 0,
    serverTime: null
  })

  const charts = ref({
    userActivity: {
      labels: [],
      datasets: []
    },
    systemPerformance: {
      labels: [],
      datasets: []
    },
    trafficStats: {
      labels: [],
      datasets: []
    }
  })

  const realtimeData = ref({
    activeConnections: 0,
    requestsPerSecond: 0,
    errorRate: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0
  })

  const systemHealth = ref({
    database: 'healthy',
    redis: 'healthy',
    api: 'healthy',
    storage: 'healthy',
    lastCheck: null
  })

  const isLoading = ref(false)
  const error = ref(null)
  const lastUpdated = ref(null)

  // Getters
  const isSystemHealthy = computed(() => {
    return Object.values(systemHealth.value)
      .filter(status => status !== null)
      .every(status => status === 'healthy')
  })

  const uptimeFormatted = computed(() => {
    const uptime = stats.value.systemUptime
    if (!uptime) return '0s'

    const days = Math.floor(uptime / 86400)
    const hours = Math.floor((uptime % 86400) / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  })

  const averageResponseTime = computed(() => {
    return `${stats.value.responseTime}ms`
  })

  const successRateFormatted = computed(() => {
    return `${stats.value.successRate}%`
  })

  // Actions
  const fetchStats = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await dashboardService.getStats()
      stats.value = response.stats
      lastUpdated.value = new Date()
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchChartData = async (period = '24h') => {
    isLoading.value = true
    error.value = null

    try {
      const response = await dashboardService.getChartData(period)
      charts.value = response.charts
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchRealtimeData = async () => {
    try {
      const response = await dashboardService.getRealtimeData()
      realtimeData.value = response.data
      return response
    } catch (err) {
      console.error('Failed to fetch realtime data:', err)
    }
  }

  const fetchSystemHealth = async () => {
    try {
      const response = await dashboardService.getSystemHealth()
      systemHealth.value = {
        ...response.health,
        lastCheck: new Date()
      }
      return response
    } catch (err) {
      console.error('Failed to fetch system health:', err)
      // Mark all services as unknown on error
      Object.keys(systemHealth.value).forEach(key => {
        if (key !== 'lastCheck') {
          systemHealth.value[key] = 'unknown'
        }
      })
    }
  }

  const fetchUserAnalytics = async (period = '7d') => {
    isLoading.value = true
    error.value = null

    try {
      const response = await dashboardService.getUserAnalytics(period)
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchPerformanceMetrics = async (period = '24h') => {
    isLoading.value = true
    error.value = null

    try {
      const response = await dashboardService.getPerformanceMetrics(period)
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const refreshDashboard = async () => {
    isLoading.value = true
    error.value = null

    try {
      await Promise.all([
        fetchStats(),
        fetchChartData(),
        fetchRealtimeData(),
        fetchSystemHealth()
      ])
    } catch {
      error.value = 'Failed to refresh dashboard data'
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Real-time updates
  const startRealtimeUpdates = (interval = 30000) => {
    const updateInterval = setInterval(() => {
      fetchRealtimeData()
      fetchSystemHealth()
    }, interval)

    return () => clearInterval(updateInterval)
  }

  return {
    // State
    stats,
    charts,
    realtimeData,
    systemHealth,
    isLoading,
    error,
    lastUpdated,

    // Getters
    isSystemHealthy,
    uptimeFormatted,
    averageResponseTime,
    successRateFormatted,

    // Actions
    fetchStats,
    fetchChartData,
    fetchRealtimeData,
    fetchSystemHealth,
    fetchUserAnalytics,
    fetchPerformanceMetrics,
    refreshDashboard,
    clearError,
    startRealtimeUpdates
  }
})

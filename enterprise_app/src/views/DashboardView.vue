<template>
  <div class="dashboard">
    <!-- Header -->
    <AppHeaderView @toggle-sidebar="toggleSidebar" />

    <!-- Sidebar -->
    <AppSidebarView :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Main Content -->
    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="container">
        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Dashboard</h1>
            <p class="page-subtitle">Welcome back, {{ user?.name }}!</p>
          </div>
          <div class="header-actions">
            <button @click="refreshData" class="refresh-btn" :disabled="isLoading">
              <ArrowPathIcon class="icon" :class="{ 'spinning': isLoading }" />
              Refresh
            </button>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-info">
                <h3 class="stat-title">Total Users</h3>
                <p class="stat-value">{{ formatNumber(stats.totalUsers) }}</p>
                <p class="stat-change positive">+{{ stats.userGrowth }}% this month</p>
              </div>
              <div class="stat-icon users">
                <UsersIcon class="icon" />
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-info">
                <h3 class="stat-title">Active Users</h3>
                <p class="stat-value">{{ formatNumber(stats.activeUsers) }}</p>
                <p class="stat-change positive">+{{ stats.activeGrowth }}% today</p>
              </div>
              <div class="stat-icon active">
                <BoltIcon class="icon" />
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-info">
                <h3 class="stat-title">Response Time</h3>
                <p class="stat-value">{{ stats.responseTime }}ms</p>
                <p class="stat-change negative">+{{ stats.responseChange }}ms slower</p>
              </div>
              <div class="stat-icon performance">
                <ClockIcon class="icon" />
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-info">
                <h3 class="stat-title">Uptime</h3>
                <p class="stat-value">{{ stats.uptime }}%</p>
                <p class="stat-change positive">{{ stats.uptimeDays }} days</p>
              </div>
              <div class="stat-icon uptime">
                <CheckCircleIcon class="icon" />
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
          <div class="chart-container">
            <CardView title="User Activity" class="chart-card">
              <template #actions>
                <select v-model="activityPeriod" @change="fetchChartData" class="period-select">
                  <option value="24h">24 Hours</option>
                  <option value="7d">7 Days</option>
                  <option value="30d">30 Days</option>
                </select>
              </template>
              <LineChart :data="chartData.userActivity" :height="300" />
            </CardView>
          </div>

          <div class="chart-container">
            <CardView title="System Performance" class="chart-card">
              <BarChart :data="chartData.performance" :height="300" />
            </CardView>
          </div>
        </div>

        <!-- Bottom Section -->
        <div class="bottom-section">
          <!-- Recent Activity -->
          <div class="activity-section">
            <CardView title="Recent Activity" class="activity-card">
              <template #actions>
                <router-link to="/notifications" class="view-all-link">View All</router-link>
              </template>

              <div class="activity-list">
                <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
                  <div class="activity-icon" :class="activity.type">
                    <component :is="getActivityIcon(activity.type)" class="icon" />
                  </div>
                  <div class="activity-content">
                    <p class="activity-text">{{ activity.message }}</p>
                    <p class="activity-time">{{ formatTimeAgo(activity.timestamp) }}</p>
                  </div>
                </div>
              </div>
            </CardView>
          </div>

          <!-- System Health -->
          <div class="health-section">
            <CardView title="System Health" class="health-card">
              <template #actions>
                <router-link to="/health" class="view-all-link">Details</router-link>
              </template>

              <div class="health-list">
                <div v-for="service in systemHealth" :key="service.name" class="health-item">
                  <div class="health-status" :class="service.status">
                    <div class="status-dot"></div>
                  </div>
                  <div class="health-content">
                    <p class="health-name">{{ service.name }}</p>
                    <p class="health-desc">{{ service.description }}</p>
                  </div>
                  <div class="health-metric">
                    <span class="metric-value">{{ service.metric }}</span>
                  </div>
                </div>
              </div>
            </CardView>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDashboardStore } from '@/stores/dashboard'
import { useSocket } from '@/composables/useSocket'
import AppHeaderView from '@/components/layout/AppHeaderView.vue'
import AppSidebarView from '@/components/layout/AppSidebarView.vue'
import CardView from '@/components/ui/CardView.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import { formatNumber, formatTimeAgo } from '@/utils/helpers'
import {
  ArrowPathIcon,
  UsersIcon,
  BoltIcon,
  ClockIcon,
  CheckCircleIcon,
  UserPlusIcon,
  ExclamationTriangleIcon,
  CogIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const dashboardStore = useDashboardStore()
const { connect, isConnected } = useSocket()

const sidebarOpen = ref(false)
const isLoading = ref(false)
const activityPeriod = ref('24h')

const user = computed(() => authStore.user)
const stats = computed(() => dashboardStore.stats)

const chartData = computed(() => dashboardStore.charts)

const recentActivity = ref([
  {
    id: 1,
    type: 'user',
    message: 'New user registered: john.doe@example.com',
    timestamp: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: 2,
    type: 'warning',
    message: 'High CPU usage detected on server-01',
    timestamp: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    id: 3,
    type: 'system',
    message: 'Database backup completed successfully',
    timestamp: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: 4,
    type: 'security',
    message: 'Security scan completed - no threats found',
    timestamp: new Date(Date.now() - 45 * 60 * 1000)
  }
])

const systemHealth = computed(() => {
  const health = dashboardStore.systemHealth
  return [
    {
      name: 'Database',
      description: 'MySQL Server',
      status: health.database,
      metric: health.database === 'healthy' ? '99.9%' : 'Down'
    },
    {
      name: 'API Server',
      description: 'Node.js backend',
      status: health.api,
      metric: stats.value.responseTime + 'ms'
    },
    {
      name: 'Redis Cache',
      description: 'In-memory cache',
      status: health.redis,
      metric: health.redis === 'healthy' ? '85%' : 'Unknown'
    },
    {
      name: 'Storage',
      description: 'Azure Storage',
      status: health.storage,
      metric: '42%'
    }
  ]
})

let refreshInterval = null

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const refreshData = async () => {
  isLoading.value = true
  try {
    await Promise.all([
      dashboardStore.fetchStats(),
      fetchChartData(),
      fetchRealtimeData(),
      dashboardStore.fetchSystemHealth()
    ])
  } catch (error) {
    console.error('Failed to refresh data:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchChartData = async () => {
  try {
    await dashboardStore.fetchChartData(activityPeriod.value)
    await dashboardStore.fetchSystemHealth()
  } catch (error) {
    console.error('Failed to fetch chart data:', error)
  }
}

const fetchRealtimeData = async () => {
  try {
    await dashboardStore.fetchRealtimeData()
  } catch (error) {
    console.error('Failed to fetch realtime data:', error)
  }
}

const getActivityIcon = (type) => {
  const icons = {
    user: UserPlusIcon,
    warning: ExclamationTriangleIcon,
    system: CogIcon,
    security: ShieldCheckIcon
  }
  return icons[type] || CogIcon
}

onMounted(async () => {
  // Initialize dashboard data
  await refreshData()

  // Connect to real-time updates
  if (!isConnected.value) {
    connect()
  }

  // Set up auto-refresh
  refreshInterval = setInterval(fetchRealtimeData, 30000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f9fafb;
}

.dark .dashboard {
  background: #111827;
}

.main-content {
  margin-left: 0;
  padding-top: 4rem;
  transition: margin-left 0.3s ease;
}

@media (min-width: 1024px) {
  .main-content {
    margin-left: 16rem;
  }

  .main-content.sidebar-open {
    margin-left: 16rem;
  }
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.dark .page-title {
  color: white;
}

.page-subtitle {
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.dark .page-subtitle {
  color: #9ca3af;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: #2563eb;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
}

.spinning {
  animation: spin 1s linear infinite;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.dark .stat-card {
  background: #1f2937;
  border-color: #374151;
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-title {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.dark .stat-title {
  color: #9ca3af;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.dark .stat-value {
  color: white;
}

.stat-change {
  font-size: 0.875rem;
  margin: 0;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon .icon {
  width: 1.5rem;
  height: 1.5rem;
  color: white;
}

.stat-icon.users {
  background: #3b82f6;
}

.stat-icon.active {
  background: #10b981;
}

.stat-icon.performance {
  background: #f59e0b;
}

.stat-icon.uptime {
  background: #8b5cf6;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 1024px) {
  .charts-section {
    grid-template-columns: 2fr 1fr;
  }
}

.chart-card {
  height: 24rem;
}

.period-select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
  color: #1f2937;
}

.dark .period-select {
  background: #374151;
  border-color: #4b5563;
  color: white;
}

.bottom-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .bottom-section {
    grid-template-columns: 2fr 1fr;
  }
}

.view-all-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
}

.view-all-link:hover {
  text-decoration: underline;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.activity-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon .icon {
  width: 1.25rem;
  height: 1.25rem;
  color: white;
}

.activity-icon.user {
  background: #3b82f6;
}

.activity-icon.warning {
  background: #f59e0b;
}

.activity-icon.system {
  background: #10b981;
}

.activity-icon.security {
  background: #8b5cf6;
}

.activity-text {
  font-size: 0.875rem;
  color: #1f2937;
  margin: 0;
}

.dark .activity-text {
  color: white;
}

.activity-time {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.dark .activity-time {
  color: #9ca3af;
}

.health-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.health-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.health-status {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
}

.status-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
}

.health-status.healthy .status-dot {
  background: #10b981;
}

.health-status.warning .status-dot {
  background: #f59e0b;
}

.health-status.error .status-dot {
  background: #ef4444;
}

.health-content {
  flex: 1;
}

.health-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
  margin: 0;
}

.dark .health-name {
  color: white;
}

.health-desc {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.dark .health-desc {
  color: #9ca3af;
}

.health-metric {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
}

.dark .health-metric {
  color: white;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>

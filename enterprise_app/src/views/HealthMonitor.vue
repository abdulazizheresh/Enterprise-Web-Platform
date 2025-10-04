<template>
  <div class="health-monitor">
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
            <h1 class="page-title">System Health Monitor</h1>
            <p class="page-subtitle">Real-time monitoring of all system components</p>
          </div>
          <div class="header-actions">
            <button @click="refreshHealth" class="refresh-btn" :disabled="isLoading">
              <ArrowPathIcon class="icon" :class="{ 'spinning': isLoading }" />
              Refresh
            </button>
            <div class="auto-refresh">
              <input id="autoRefresh" v-model="autoRefresh" type="checkbox" class="checkbox"
                @change="toggleAutoRefresh" />
              <label for="autoRefresh" class="checkbox-label">Auto-refresh</label>
            </div>
          </div>
        </div>

        <!-- Overall Health Status -->
        <div class="health-overview">
          <div class="status-card" :class="overallStatus.type">
            <div class="status-icon">
              <component :is="overallStatus.icon" class="icon-large" />
            </div>
            <div class="status-content">
              <h2 class="status-title">{{ overallStatus.title }}</h2>
              <p class="status-description">{{ overallStatus.description }}</p>
              <p class="status-timestamp">Last updated: {{ formatTimeAgo(lastUpdated) }}</p>
            </div>
          </div>
        </div>

        <!-- Service Status Grid -->
        <div class="services-section">
          <h2 class="section-title">Service Status</h2>
          <div class="services-grid">
            <div v-for="service in services" :key="service.name" class="service-card" :class="service.status">
              <div class="service-header">
                <div class="service-icon" :class="service.status">
                  <component :is="getServiceIcon(service.type)" class="icon" />
                </div>
                <div class="service-info">
                  <h3 class="service-name">{{ service.name }}</h3>
                  <p class="service-description">{{ service.description }}</p>
                </div>
                <div class="service-status">
                  <span class="status-badge" :class="service.status">{{ service.status }}</span>
                </div>
              </div>

              <div class="service-metrics">
                <div class="metric">
                  <span class="metric-label">Response Time</span>
                  <span class="metric-value">{{ service.responseTime }}ms</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Uptime</span>
                  <span class="metric-value">{{ service.uptime }}%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Load</span>
                  <span class="metric-value">{{ service.load }}%</span>
                </div>
              </div>

              <div class="service-chart">
                <div class="chart-mini">
                  <div v-for="(point, index) in service.history" :key="index" class="chart-bar"
                    :style="{ height: `${point}%` }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Infrastructure Metrics -->
        <div class="metrics-section">
          <h2 class="section-title">Infrastructure Metrics</h2>
          <div class="metrics-grid">
            <CardView title="Server Performance" class="metric-card">
              <div class="performance-metrics">
                <div class="performance-item">
                  <div class="performance-header">
                    <span class="performance-label">CPU Usage</span>
                    <span class="performance-value">{{ serverMetrics.cpu }}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill cpu" :style="{ width: `${serverMetrics.cpu}%` }"></div>
                  </div>
                </div>

                <div class="performance-item">
                  <div class="performance-header">
                    <span class="performance-label">Memory Usage</span>
                    <span class="performance-value">{{ serverMetrics.memory }}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill memory" :style="{ width: `${serverMetrics.memory}%` }"></div>
                  </div>
                </div>

                <div class="performance-item">
                  <div class="performance-header">
                    <span class="performance-label">Disk Usage</span>
                    <span class="performance-value">{{ serverMetrics.disk }}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill disk" :style="{ width: `${serverMetrics.disk}%` }"></div>
                  </div>
                </div>

                <div class="performance-item">
                  <div class="performance-header">
                    <span class="performance-label">Network I/O</span>
                    <span class="performance-value">{{ serverMetrics.network }} MB/s</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill network"
                      :style="{ width: `${Math.min(serverMetrics.network * 10, 100)}%` }"></div>
                  </div>
                </div>
              </div>
            </CardView>

            <CardView title="Response Time Trends" class="metric-card">
              <LineChart :data="responseTimeData" :height="200" />
            </CardView>

            <CardView title="Error Rates" class="metric-card">
              <BarChart :data="errorRateData" :height="200" />
            </CardView>
          </div>
        </div>

        <!-- Recent Incidents -->
        <div class="incidents-section">
          <CardView title="Recent Incidents" class="incidents-card">
            <template #actions>
              <button @click="clearIncidents" class="clear-btn">Clear All</button>
            </template>

            <div v-if="incidents.length === 0" class="no-incidents">
              <CheckCircleIcon class="no-incidents-icon" />
              <p class="no-incidents-text">No incidents in the last 24 hours</p>
            </div>

            <div v-else class="incidents-list">
              <div v-for="incident in incidents" :key="incident.id" class="incident-item" :class="incident.severity">
                <div class="incident-icon">
                  <component :is="getIncidentIcon(incident.severity)" class="icon" />
                </div>
                <div class="incident-content">
                  <h4 class="incident-title">{{ incident.title }}</h4>
                  <p class="incident-description">{{ incident.description }}</p>
                  <div class="incident-meta">
                    <span class="incident-time">{{ formatTimeAgo(incident.timestamp) }}</span>
                    <span class="incident-severity" :class="incident.severity">{{ incident.severity }}</span>
                  </div>
                </div>
                <div class="incident-actions">
                  <button @click="resolveIncident(incident.id)" class="resolve-btn">
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          </CardView>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import AppHeaderView from '@/components/layout/AppHeaderView.vue'
import AppSidebarView from '@/components/layout/AppSidebarView.vue'
import CardView from '@/components/ui/CardView.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import { formatTimeAgo } from '@/utils/helpers'
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ServerIcon,
  CircleStackIcon,
  CloudIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  WifiIcon
} from '@heroicons/vue/24/outline'

const dashboardStore = useDashboardStore()

const sidebarOpen = ref(false)
const isLoading = ref(false)
const autoRefresh = ref(true)
const lastUpdated = ref(new Date())

const services = reactive([
  {
    name: 'API Server',
    description: 'Node.js backend service',
    status: 'healthy',
    type: 'api',
    responseTime: 145,
    uptime: 99.9,
    load: 65,
    history: [45, 52, 48, 61, 58, 65, 59, 62, 55, 49]
  },
  {
    name: 'Database',
    description: 'PostgreSQL primary cluster',
    status: 'healthy',
    type: 'database',
    responseTime: 23,
    uptime: 99.8,
    load: 78,
    history: [71, 75, 78, 82, 79, 76, 78, 81, 77, 78]
  },
  {
    name: 'Redis Cache',
    description: 'In-memory data store',
    status: 'warning',
    type: 'cache',
    responseTime: 5,
    uptime: 99.5,
    load: 85,
    history: [65, 72, 78, 81, 85, 88, 85, 82, 84, 85]
  },
  {
    name: 'File Storage',
    description: 'Azure Blob Storage',
    status: 'healthy',
    type: 'storage',
    responseTime: 89,
    uptime: 99.9,
    load: 42,
    history: [38, 41, 42, 45, 43, 40, 42, 44, 41, 42]
  },
  {
    name: 'CDN',
    description: 'Azure CDN endpoints',
    status: 'healthy',
    type: 'cdn',
    responseTime: 12,
    uptime: 99.9,
    load: 56,
    history: [52, 54, 56, 58, 55, 53, 56, 59, 57, 56]
  },
  {
    name: 'Security Scanner',
    description: 'Automated security monitoring',
    status: 'error',
    type: 'security',
    responseTime: 0,
    uptime: 95.2,
    load: 0,
    history: [45, 48, 42, 0, 0, 0, 15, 25, 35, 0]
  }
])

const serverMetrics = reactive({
  cpu: 65,
  memory: 78,
  disk: 42,
  network: 8.5
})

const incidents = ref([
  {
    id: 1,
    title: 'High Redis Memory Usage',
    description: 'Redis cache memory usage exceeded 85% threshold',
    severity: 'warning',
    timestamp: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    id: 2,
    title: 'Security Scanner Offline',
    description: 'Automated security scanner service is not responding',
    severity: 'critical',
    timestamp: new Date(Date.now() - 45 * 60 * 1000)
  }
])

const responseTimeData = reactive({
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
  datasets: [{
    label: 'Response Time (ms)',
    data: [120, 145, 165, 189, 156, 145],
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)'
  }]
})

const errorRateData = reactive({
  labels: ['API', 'Database', 'Cache', 'Storage'],
  datasets: [{
    label: 'Error Rate %',
    data: [0.1, 0.05, 0.8, 0.02],
    backgroundColor: ['#10b981', '#10b981', '#f59e0b', '#10b981']
  }]
})

let refreshInterval = null

const overallStatus = computed(() => {
  const criticalServices = services.filter(s => s.status === 'error').length
  const warningServices = services.filter(s => s.status === 'warning').length

  if (criticalServices > 0) {
    return {
      type: 'error',
      icon: XCircleIcon,
      title: 'System Issues Detected',
      description: `${criticalServices} critical issue${criticalServices > 1 ? 's' : ''} requiring immediate attention`
    }
  } else if (warningServices > 0) {
    return {
      type: 'warning',
      icon: ExclamationTriangleIcon,
      title: 'System Warnings',
      description: `${warningServices} service${warningServices > 1 ? 's' : ''} showing warnings`
    }
  } else {
    return {
      type: 'healthy',
      icon: CheckCircleIcon,
      title: 'All Systems Operational',
      description: 'All services are running normally'
    }
  }
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const refreshHealth = async () => {
  isLoading.value = true
  try {
    await dashboardStore.fetchSystemHealth()
    lastUpdated.value = new Date()

    // Simulate some metric updates
    serverMetrics.cpu = Math.max(30, Math.min(90, serverMetrics.cpu + (Math.random() - 0.5) * 10))
    serverMetrics.memory = Math.max(40, Math.min(95, serverMetrics.memory + (Math.random() - 0.5) * 8))
    serverMetrics.network = Math.max(1, Math.min(15, serverMetrics.network + (Math.random() - 0.5) * 2))
  } catch (error) {
    console.error('Failed to refresh health data:', error)
  } finally {
    isLoading.value = false
  }
}

const toggleAutoRefresh = () => {
  if (autoRefresh.value) {
    refreshInterval = setInterval(refreshHealth, 30000)
  } else {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }
}

const getServiceIcon = (type) => {
  const icons = {
    api: ServerIcon,
    database: CircleStackIcon,
    cache: CpuChipIcon,
    storage: CloudIcon,
    cdn: WifiIcon,
    security: ShieldCheckIcon
  }
  return icons[type] || ServerIcon
}

const getIncidentIcon = (severity) => {
  const icons = {
    critical: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: CheckCircleIcon
  }
  return icons[severity] || ExclamationTriangleIcon
}

const resolveIncident = (id) => {
  const index = incidents.value.findIndex(i => i.id === id)
  if (index > -1) {
    incidents.value.splice(index, 1)
  }
}

const clearIncidents = () => {
  incidents.value = []
}

onMounted(() => {
  refreshHealth()
  if (autoRefresh.value) {
    toggleAutoRefresh()
  }
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.health-monitor {
  min-height: 100vh;
  background: #f9fafb;
}

.dark .health-monitor {
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
  flex-wrap: wrap;
  gap: 1rem;
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
  align-items: center;
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

.auto-refresh {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox {
  width: 1rem;
  height: 1rem;
  accent-color: #3b82f6;
}

.checkbox-label {
  font-size: 0.875rem;
  color: #374151;
}

.dark .checkbox-label {
  color: #d1d5db;
}

.icon {
  width: 1rem;
  height: 1rem;
}

.icon-large {
  width: 2rem;
  height: 2rem;
}

.spinning {
  animation: spin 1s linear infinite;
}

.health-overview {
  margin-bottom: 2rem;
}

.status-card {
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.dark .status-card {
  background: #1f2937;
  border-color: #374151;
}

.status-card.healthy {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
}

.dark .status-card.healthy {
  background: rgba(16, 185, 129, 0.1);
  border-color: #10b981;
}

.status-card.warning {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
}

.dark .status-card.warning {
  background: rgba(245, 158, 11, 0.1);
  border-color: #f59e0b;
}

.status-card.error {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2, #fecaca);
}

.dark .status-card.error {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

.status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  flex-shrink: 0;
}

.status-card.healthy .status-icon {
  background: #10b981;
  color: white;
}

.status-card.warning .status-icon {
  background: #f59e0b;
  color: white;
}

.status-card.error .status-icon {
  background: #ef4444;
  color: white;
}

.status-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.dark .status-title {
  color: white;
}

.status-description {
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.dark .status-description {
  color: #9ca3af;
}

.status-timestamp {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
}

.section-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
}

.dark .section-title {
  color: white;
}

.services-section {
  margin-bottom: 2rem;
}

.services-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.service-card {
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.service-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.dark .service-card {
  background: #1f2937;
  border-color: #374151;
}

.service-card.warning {
  border-left: 4px solid #f59e0b;
}

.service-card.error {
  border-left: 4px solid #ef4444;
}

.service-card.healthy {
  border-left: 4px solid #10b981;
}

.service-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.service-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.service-icon.healthy {
  background: #10b981;
  color: white;
}

.service-icon.warning {
  background: #f59e0b;
  color: white;
}

.service-icon.error {
  background: #ef4444;
  color: white;
}

.service-info {
  flex: 1;
}

.service-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.dark .service-name {
  color: white;
}

.service-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.dark .service-description {
  color: #9ca3af;
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
}

.status-badge.healthy {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.warning {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.error {
  background: #fecaca;
  color: #991b1b;
}

.service-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.metric {
  text-align: center;
}

.metric-label {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.dark .metric-label {
  color: #9ca3af;
}

.metric-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .metric-value {
  color: white;
}

.service-chart {
  height: 2rem;
}

.chart-mini {
  display: flex;
  align-items: end;
  gap: 2px;
  height: 100%;
}

.chart-bar {
  flex: 1;
  background: #3b82f6;
  border-radius: 1px;
  min-height: 2px;
  opacity: 0.7;
}

.metrics-section {
  margin-bottom: 2rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .metrics-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.performance-metrics {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.performance-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.performance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.performance-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .performance-label {
  color: #9ca3af;
}

.performance-value {
  font-weight: 600;
  color: #1f2937;
}

.dark .performance-value {
  color: white;
}

.progress-bar {
  height: 0.5rem;
  background: #e5e7eb;
  border-radius: 0.25rem;
  overflow: hidden;
}

.dark .progress-bar {
  background: #4b5563;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-fill.cpu {
  background: #ef4444;
}

.progress-fill.memory {
  background: #f59e0b;
}

.progress-fill.disk {
  background: #10b981;
}

.progress-fill.network {
  background: #3b82f6;
}

.incidents-section {
  margin-bottom: 2rem;
}

.clear-btn {
  font-size: 0.875rem;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
}

.clear-btn:hover {
  color: #374151;
}

.dark .clear-btn {
  color: #9ca3af;
}

.dark .clear-btn:hover {
  color: #d1d5db;
}

.no-incidents {
  text-align: center;
  padding: 2rem;
}

.no-incidents-icon {
  width: 3rem;
  height: 3rem;
  color: #10b981;
  margin: 0 auto 1rem;
}

.no-incidents-text {
  color: #6b7280;
  margin: 0;
}

.dark .no-incidents-text {
  color: #9ca3af;
}

.incidents-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.incident-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.dark .incident-item {
  border-color: #374151;
}

.incident-item.warning {
  background: #fffbeb;
  border-color: #fde68a;
}

.dark .incident-item.warning {
  background: rgba(245, 158, 11, 0.1);
  border-color: #f59e0b;
}

.incident-item.critical {
  background: #fef2f2;
  border-color: #fecaca;
}

.dark .incident-item.critical {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

.incident-icon {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.incident-item.warning .incident-icon {
  color: #f59e0b;
}

.incident-item.critical .incident-icon {
  color: #ef4444;
}

.incident-content {
  flex: 1;
}

.incident-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.dark .incident-title {
  color: white;
}

.incident-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.dark .incident-description {
  color: #9ca3af;
}

.incident-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.incident-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.incident-severity {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
}

.incident-severity.warning {
  background: #fef3c7;
  color: #92400e;
}

.incident-severity.critical {
  background: #fecaca;
  color: #991b1b;
}

.resolve-btn {
  padding: 0.375rem 0.75rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.resolve-btn:hover {
  background: #059669;
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

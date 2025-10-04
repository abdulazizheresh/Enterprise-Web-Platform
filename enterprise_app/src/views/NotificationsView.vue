<template>
  <div class="notifications-page">
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
            <h1 class="page-title">Notifications</h1>
            <p class="page-subtitle">Stay updated with system alerts and activity</p>
          </div>
          <div class="header-actions">
            <button @click="markAllAsRead" class="action-btn" :disabled="unreadCount === 0">
              <CheckIcon class="icon" />
              Mark All Read
            </button>
            <button @click="clearAll" class="action-btn secondary">
              <TrashIcon class="icon" />
              Clear All
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="filters-section">
          <div class="filter-tabs">
            <button v-for="filter in filters" :key="filter.key" @click="activeFilter = filter.key" class="filter-tab"
              :class="{ active: activeFilter === filter.key }">
              {{ filter.label }}
              <span v-if="filter.count > 0" class="filter-count">{{ filter.count }}</span>
            </button>
          </div>

          <div class="filter-controls">
            <select v-model="sortBy" class="sort-select">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>

        <!-- Notifications List -->
        <div class="notifications-section">
          <div v-if="filteredNotifications.length === 0" class="empty-state">
            <BellSlashIcon class="empty-icon" />
            <h3 class="empty-title">No notifications</h3>
            <p class="empty-description">
              {{ activeFilter === 'all' ? 'You\'re all caught up!' : `No ${activeFilter} notifications` }}
            </p>
          </div>

          <div v-else class="notifications-list">
            <div v-for="notification in filteredNotifications" :key="notification.id" class="notification-item" :class="{
              unread: !notification.read,
              [notification.type]: true
            }">
              <div class="notification-icon" :class="notification.type">
                <component :is="getNotificationIcon(notification.type)" class="icon" />
              </div>

              <div class="notification-content">
                <div class="notification-header">
                  <h4 class="notification-title">{{ notification.title }}</h4>
                  <div class="notification-meta">
                    <span class="notification-time">{{ formatTimeAgo(notification.timestamp) }}</span>
                    <span v-if="notification.priority" class="priority-badge" :class="notification.priority">
                      {{ notification.priority }}
                    </span>
                  </div>
                </div>

                <p class="notification-message">{{ notification.message }}</p>

                <div v-if="notification.actions" class="notification-actions">
                  <button v-for="action in notification.actions" :key="action.label"
                    @click="handleAction(notification.id, action)" class="action-button" :class="action.style">
                    {{ action.label }}
                  </button>
                </div>
              </div>

              <div class="notification-controls">
                <button @click="toggleRead(notification.id)" class="control-btn"
                  :title="notification.read ? 'Mark as unread' : 'Mark as read'">
                  <EyeIcon v-if="!notification.read" class="icon" />
                  <EyeSlashIcon v-else class="icon" />
                </button>

                <button @click="deleteNotification(notification.id)" class="control-btn delete"
                  title="Delete notification">
                  <XMarkIcon class="icon" />
                </button>
              </div>
            </div>
          </div>

          <!-- Load More -->
          <div v-if="hasMore" class="load-more">
            <button @click="loadMore" class="load-more-btn" :disabled="isLoading">
              <div v-if="isLoading" class="loading-spinner"></div>
              {{ isLoading ? 'Loading...' : 'Load More' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// import { useNotificationsStore } from '@/stores/notifications'
import AppHeaderView from '@/components/layout/AppHeaderView.vue'
import AppSidebarView from '@/components/layout/AppSidebarView.vue'
import { formatTimeAgo } from '@/utils/helpers'
import {
  CheckIcon,
  TrashIcon,
  BellSlashIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  UserPlusIcon,
  CogIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'

// const notificationsStore = useNotificationsStore()

const sidebarOpen = ref(false)
const activeFilter = ref('all')
const sortBy = ref('newest')
const isLoading = ref(false)
const hasMore = ref(true)

const notifications = ref([
  {
    id: 1,
    type: 'info',
    title: 'System Update Available',
    message: 'A new system update is available for installation. This update includes security patches and performance improvements.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    priority: 'medium',
    actions: [
      { label: 'Update Now', style: 'primary', action: 'update' },
      { label: 'Schedule Later', style: 'secondary', action: 'schedule' }
    ]
  },
  {
    id: 2,
    type: 'warning',
    title: 'High CPU Usage Alert',
    message: 'Server CPU usage has exceeded 85% for the past 10 minutes. Consider scaling up resources.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    priority: 'high',
    actions: [
      { label: 'Scale Up', style: 'primary', action: 'scale' },
      { label: 'View Details', style: 'secondary', action: 'view' }
    ]
  },
  {
    id: 3,
    type: 'success',
    title: 'Backup Completed',
    message: 'Daily backup process completed successfully. All data has been backed up to Azure Storage.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    priority: 'low'
  },
  {
    id: 4,
    type: 'error',
    title: 'Database Connection Failed',
    message: 'Unable to connect to the primary database. Failover to secondary database initiated.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: false,
    priority: 'critical',
    actions: [
      { label: 'Investigate', style: 'primary', action: 'investigate' },
      { label: 'Contact Support', style: 'secondary', action: 'support' }
    ]
  },
  {
    id: 5,
    type: 'user',
    title: 'New User Registration',
    message: 'john.doe@example.com has registered for an account and is pending approval.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: true,
    priority: 'low',
    actions: [
      { label: 'Approve', style: 'primary', action: 'approve' },
      { label: 'Review', style: 'secondary', action: 'review' }
    ]
  },
  {
    id: 6,
    type: 'security',
    title: 'Security Scan Completed',
    message: 'Weekly security scan completed. No vulnerabilities detected.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: true,
    priority: 'medium'
  }
])

const unreadCount = computed(() =>
  notifications.value.filter(n => !n.read).length
)

const filters = computed(() => [
  { key: 'all', label: 'All', count: notifications.value.length },
  { key: 'unread', label: 'Unread', count: unreadCount.value },
  { key: 'info', label: 'Info', count: notifications.value.filter(n => n.type === 'info').length },
  { key: 'warning', label: 'Warning', count: notifications.value.filter(n => n.type === 'warning').length },
  { key: 'error', label: 'Error', count: notifications.value.filter(n => n.type === 'error').length },
  { key: 'success', label: 'Success', count: notifications.value.filter(n => n.type === 'success').length }
])

const filteredNotifications = computed(() => {
  let filtered = notifications.value

  // Apply filter
  if (activeFilter.value === 'unread') {
    filtered = filtered.filter(n => !n.read)
  } else if (activeFilter.value !== 'all') {
    filtered = filtered.filter(n => n.type === activeFilter.value)
  }

  // Apply sorting
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'oldest':
        return new Date(a.timestamp) - new Date(b.timestamp)
      case 'priority': {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
        return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3)
      }
      default: // newest
        return new Date(b.timestamp) - new Date(a.timestamp)
    }
  })

  return filtered
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const clearAll = () => {
  notifications.value = []
}

const toggleRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = !notification.read
  }
}

const deleteNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const handleAction = (notificationId, action) => {
  console.log(`Action ${action.action} for notification ${notificationId}`)
  // Implement action handling
}

const loadMore = () => {
  isLoading.value = true
  // Simulate loading more notifications
  setTimeout(() => {
    isLoading.value = false
    hasMore.value = false
  }, 1000)
}

const getNotificationIcon = (type) => {
  const icons = {
    info: InformationCircleIcon,
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    error: XCircleIcon,
    user: UserPlusIcon,
    system: CogIcon,
    security: ShieldCheckIcon
  }
  return icons[type] || InformationCircleIcon
}

onMounted(() => {
  // Load notifications from store if needed
})
</script>

<style scoped>
.notifications-page {
  min-height: 100vh;
  background: #f9fafb;
}

.dark .notifications-page {
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
  gap: 0.75rem;
}

.action-btn {
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

.action-btn:hover:not(:disabled) {
  background: #2563eb;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.secondary {
  background: #6b7280;
}

.action-btn.secondary:hover:not(:disabled) {
  background: #4b5563;
}

.icon {
  width: 1rem;
  height: 1rem;
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.filter-tab:hover {
  background: #f9fafb;
}

.filter-tab.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.dark .filter-tab {
  background: #1f2937;
  border-color: #374151;
  color: #9ca3af;
}

.dark .filter-tab:hover {
  background: #374151;
}

.dark .filter-tab.active {
  background: #3b82f6;
  color: white;
}

.filter-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.125rem 0.375rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.filter-tab.active .filter-count {
  background: rgba(255, 255, 255, 0.3);
}

.sort-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  color: #1f2937;
}

.dark .sort-select {
  background: #1f2937;
  border-color: #374151;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: #9ca3af;
  margin: 0 auto 1rem;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.dark .empty-title {
  color: white;
}

.empty-description {
  color: #6b7280;
  margin: 0;
}

.dark .empty-description {
  color: #9ca3af;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  transition: all 0.2s ease;
}

.notification-item:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.notification-item.unread {
  border-left: 4px solid #3b82f6;
  background: #f8fafc;
}

.dark .notification-item {
  background: #1f2937;
  border-color: #374151;
}

.dark .notification-item.unread {
  background: #1e3a8a;
  background: rgba(59, 130, 246, 0.05);
}

.notification-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-icon.info {
  background: #dbeafe;
  color: #2563eb;
}

.notification-icon.success {
  background: #d1fae5;
  color: #059669;
}

.notification-icon.warning {
  background: #fef3c7;
  color: #d97706;
}

.notification-icon.error {
  background: #fecaca;
  color: #dc2626;
}

.notification-icon.user {
  background: #e0e7ff;
  color: #7c3aed;
}

.notification-icon.security {
  background: #f3e8ff;
  color: #a855f7;
}

.notification-content {
  flex: 1;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  gap: 1rem;
}

.notification-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.dark .notification-title {
  color: white;
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.notification-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.priority-badge {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
}

.priority-badge.critical {
  background: #fecaca;
  color: #991b1b;
}

.priority-badge.high {
  background: #fed7aa;
  color: #c2410c;
}

.priority-badge.medium {
  background: #fef3c7;
  color: #a16207;
}

.priority-badge.low {
  background: #e5e7eb;
  color: #374151;
}

.notification-message {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.dark .notification-message {
  color: #9ca3af;
}

.notification-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-button {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button.primary {
  background: #3b82f6;
  color: white;
}

.action-button.primary:hover {
  background: #2563eb;
}

.action-button.secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.action-button.secondary:hover {
  background: #e5e7eb;
}

.dark .action-button.secondary {
  background: #374151;
  color: #d1d5db;
  border-color: #4b5563;
}

.dark .action-button.secondary:hover {
  background: #4b5563;
}

.notification-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
}

.control-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 0.375rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.control-btn.delete:hover {
  background: #fef2f2;
  color: #dc2626;
}

.dark .control-btn:hover {
  background: #374151;
  color: #d1d5db;
}

.dark .control-btn.delete:hover {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

.load-more {
  text-align: center;
  margin-top: 2rem;
}

.load-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 auto;
}

.load-more-btn:hover:not(:disabled) {
  background: #e5e7eb;
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dark .load-more-btn {
  background: #374151;
  border-color: #4b5563;
  color: #d1d5db;
}

.dark .load-more-btn:hover:not(:disabled) {
  background: #4b5563;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
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

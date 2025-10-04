<template>
  <aside class="sidebar" :class="{ 'sidebar-closed': !isOpen }">
    <!-- Sidebar header -->
    <div class="sidebar-header">
      <div class="brand">
        <img class="logo" src="/logo.svg" alt="Enterprise" />
        <span class="brand-text">Enterprise</span>
      </div>
      <button @click="closeSidebar" class="close-btn">
        <XMarkIcon class="icon" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <!-- Main navigation items -->
      <div class="nav-section">
        <router-link v-for="item in mainNavigation" :key="item.name" :to="item.href" class="nav-item"
          :class="{ 'nav-item-active': isActiveRoute(item.href) }" @click="closeSidebar">
          <component :is="item.icon" class="nav-icon" />
          {{ item.name }}
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </router-link>
      </div>

      <!-- Divider -->
      <div class="nav-divider">
        <h3 class="nav-heading">Management</h3>
        <div class="nav-section">
          <router-link v-for="item in managementNavigation" :key="item.name" :to="item.href" class="nav-item"
            :class="{ 'nav-item-active': isActiveRoute(item.href) }" @click="closeSidebar">
            <component :is="item.icon" class="nav-icon" />
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Sidebar footer -->
    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-details">
          <!-- <img class="user-avatar" :src="user?.avatar || '/user_icon.png'" :alt="user?.name" /> -->
          <img class="user-avatar" src="/user_icon.png" :alt="user?.name" />
          <div class="user-text">
            <p class="user-name">{{ user?.name }}</p>
            <p class="user-email">{{ user?.email }}</p>
          </div>
        </div>
        <button @click="handleLogout" class="logout-btn" title="Sign out">
          <ArrowRightOnRectangleIcon class="icon" />
        </button>
      </div>
    </div>
  </aside>

  <!-- Overlay for mobile -->
  <div v-if="isOpen" class="sidebar-overlay" @click="closeSidebar"></div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import {
  HomeIcon,
  ChartBarIcon,
  BellIcon,
  UserIcon,
  CogIcon,
  HeartIcon,
  UsersIcon,
  DocumentTextIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

// Props
// const props = defineProps({
//   isOpen: {
//     type: Boolean,
//     default: false
//   }
// })

// Emits
const emit = defineEmits(['close'])

// Stores
const authStore = useAuthStore()
const notificationsStore = useNotificationsStore()
const route = useRoute()
const router = useRouter()

// Computed
const user = computed(() => authStore.user)
const unreadNotifications = computed(() => notificationsStore.unreadCount)

// Navigation items
const mainNavigation = computed(() => [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: ChartBarIcon
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: BellIcon,
    badge: unreadNotifications.value > 0 ? unreadNotifications.value : null
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: UserIcon
  },
  {
    name: 'Health Monitor',
    href: '/health',
    icon: HeartIcon
  }
])

const managementNavigation = [
  {
    name: 'Users',
    href: '/users',
    icon: UsersIcon
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: DocumentTextIcon
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: CogIcon
  }
]

// Methods
const isActiveRoute = (href) => {
  return route.path === href || route.path.startsWith(href + '/')
}

const closeSidebar = () => {
  emit('close')
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/auth/login')
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 16rem;
  background: white;
  border-right: 1px solid #e5e7eb;
  z-index: 50;
  transform: translateX(0);
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
}

.dark .sidebar {
  background: #1f2937;
  border-color: #374151;
}

.sidebar-closed {
  transform: translateX(-100%);
}

@media (min-width: 1024px) {
  .sidebar {
    transform: translateX(0);
  }

  .sidebar-closed {
    transform: translateX(0);
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
  padding: 0 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .sidebar-header {
  border-color: #374151;
}

.brand {
  display: flex;
  align-items: center;
}

.logo {
  height: 2rem;
  width: 2rem;
}

.brand-text {
  margin-left: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .brand-text {
  color: white;
}

.close-btn {
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  display: block;
}

.close-btn:hover {
  color: #374151;
  background: #f3f4f6;
}

.dark .close-btn {
  color: #9ca3af;
}

.dark .close-btn:hover {
  color: #d1d5db;
  background: #374151;
}

@media (min-width: 1024px) {
  .close-btn {
    display: none;
  }
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  position: relative;
}

.nav-item:hover {
  background: #f3f4f6;
}

.dark .nav-item {
  color: #d1d5db;
}

.dark .nav-item:hover {
  background: #374151;
}

.nav-item-active {
  background: #dbeafe;
  color: #1d4ed8;
}

.dark .nav-item-active {
  background: #1e3a8a;
  color: #93c5fd;
}

.nav-icon {
  height: 1rem;
  width: 1rem;
  margin-right: 0.75rem;
  flex-shrink: 0;
  color: #9ca3af;
}

.nav-item:hover .nav-icon {
  color: #6b7280;
}

.dark .nav-item:hover .nav-icon {
  color: #d1d5db;
}

.nav-item-active .nav-icon {
  color: #3b82f6;
}

.dark .nav-item-active .nav-icon {
  color: #60a5fa;
}

.nav-badge {
  margin-left: auto;
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 9999px;
}

.dark .nav-badge {
  background: #7f1d1d;
  color: #fca5a5;
}

.nav-divider {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
  margin-top: 1rem;
}

.dark .nav-divider {
  border-color: #374151;
}

.nav-heading {
  padding: 0 0.75rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.dark .nav-heading {
  color: #9ca3af;
}

.sidebar-footer {
  flex-shrink: 0;
  border-top: 1px solid #e5e7eb;
  padding: 1rem;
}

.dark .sidebar-footer {
  border-color: #374151;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-details {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.user-avatar {
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.user-text {
  margin-left: 0.75rem;
  min-width: 0;
  flex: 1;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark .user-name {
  color: white;
}

.user-email {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark .user-email {
  color: #9ca3af;
}

.logout-btn {
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  color: #374151;
  background: #f3f4f6;
}

.dark .logout-btn {
  color: #9ca3af;
}

.dark .logout-btn:hover {
  color: #d1d5db;
  background: #374151;
}

.icon {
  height: 1rem;
  width: 1rem;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
  display: block;
}

@media (min-width: 1024px) {
  .sidebar-overlay {
    display: none;
  }
}
</style>

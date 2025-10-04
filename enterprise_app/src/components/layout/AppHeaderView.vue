<template>
  <header class="header">
    <div class="header-container">
      <div class="header-content">
        <!-- Logo and brand -->
        <div class="header-left">
          <button @click="toggleSidebar" class="mobile-menu-btn">
            <Bars3Icon class="icon" />
          </button>

          <div class="brand">
            <img class="logo" src="/logo.svg" alt="Enterprise" />
            <span class="brand-text">Enterprise</span>
          </div>
        </div>

        <!-- Search bar -->
        <div class="search-container">
          <div class="search-wrapper">
            <div class="search-icon-wrapper">
              <MagnifyingGlassIcon class="search-icon" />
            </div>
            <input type="text" placeholder="Search..." class="search-input" />
          </div>
        </div>

        <!-- Right side -->
        <div class="header-right">
          <!-- Theme toggle -->
          <button @click="toggleTheme" class="action-btn">
            <SunIcon v-if="isDarkMode" class="icon" />
            <MoonIcon v-else class="icon" />
          </button>

          <!-- Notifications -->
          <div class="notification-wrapper">
            <button @click="toggleNotifications" class="action-btn notification-btn">
              <BellIcon class="icon" />
              <span v-if="unreadCount > 0" class="notification-badge">
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </button>
          </div>

          <!-- User menu -->
          <div class="user-menu-wrapper">
            <button @click="toggleUserMenu" class="user-menu-btn">
              <!-- <img class="user-avatar" :src="user?.avatar || '/user_icon.png'" :alt="user?.name" /> -->
              <img class="user-avatar" src="/user_icon.png" :alt="user?.name" />
              <span class="user-name">{{ user?.name }}</span>
              <ChevronDownIcon class="chevron-icon" />
            </button>

            <!-- User dropdown -->
            <div v-if="showUserMenu" class="dropdown">
              <div class="dropdown-content">
                <router-link to="/profile" class="dropdown-item" @click="showUserMenu = false">
                  Profile
                </router-link>
                <router-link to="/settings" class="dropdown-item" @click="showUserMenu = false">
                  Settings
                </router-link>
                <hr class="dropdown-divider" />
                <button @click="handleLogout" class="dropdown-item dropdown-button">
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import { useTheme } from '@/composables/useTheme'
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

// Emits
const emit = defineEmits(['toggle-sidebar'])

// Stores
const authStore = useAuthStore()
const notificationsStore = useNotificationsStore()
const router = useRouter()

// Composables
const { isDarkMode, toggleTheme } = useTheme()

// State
const showUserMenu = ref(false)
const showNotifications = ref(false)

// Computed
const user = computed(() => authStore.user)
const unreadCount = computed(() => notificationsStore.unreadCount)

// Methods
const toggleSidebar = () => {
  emit('toggle-sidebar')
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/auth/login')
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.user-menu-wrapper')) {
    showUserMenu.value = false
    showNotifications.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 40;
}

.dark .header {
  background: #1f2937;
  border-color: #374151;
}

.header-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .header-container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .header-container {
    padding: 0 2rem;
  }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
}

.header-left {
  display: flex;
  align-items: center;
}

.mobile-menu-btn {
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  display: block;
}

.mobile-menu-btn:hover {
  color: #374151;
  background: #f3f4f6;
}

.dark .mobile-menu-btn {
  color: #9ca3af;
}

.dark .mobile-menu-btn:hover {
  color: #d1d5db;
  background: #374151;
}

@media (min-width: 1024px) {
  .mobile-menu-btn {
    display: none;
  }
}

.brand {
  display: flex;
  align-items: center;
  margin-left: 1rem;
}

@media (min-width: 1024px) {
  .brand {
    margin-left: 0;
  }
}

.logo {
  height: 2rem;
  width: 2rem;
}

.brand-text {
  margin-left: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .brand-text {
  color: white;
}

.search-container {
  flex: 1;
  max-width: 28rem;
  margin: 0 2rem;
  display: none;
}

@media (min-width: 768px) {
  .search-container {
    display: block;
  }
}

.search-wrapper {
  position: relative;
}

.search-icon-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding-left: 0.75rem;
  pointer-events: none;
}

.search-icon {
  height: 1rem;
  width: 1rem;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #1f2937;
  font-size: 0.875rem;
  line-height: 1.25;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.search-input::placeholder {
  color: #6b7280;
}

.dark .search-input {
  background: #374151;
  border-color: #4b5563;
  color: white;
}

.dark .search-input::placeholder {
  color: #9ca3af;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.action-btn {
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.action-btn:hover {
  color: #374151;
  background: #f3f4f6;
}

.dark .action-btn {
  color: #9ca3af;
}

.dark .action-btn:hover {
  color: #d1d5db;
  background: #374151;
}

.icon {
  height: 1rem;
  width: 1rem;
}

.notification-wrapper {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  height: 1.25rem;
  width: 1.25rem;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.user-menu-wrapper {
  position: relative;
}

.user-menu-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.user-menu-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px #3b82f6;
}

.user-avatar {
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  color: #374151;
  display: none;
}

.dark .user-name {
  color: #d1d5db;
}

@media (min-width: 1024px) {
  .user-name {
    display: block;
  }
}

.chevron-icon {
  height: 0.75rem;
  width: 0.75rem;
  color: #9ca3af;
  display: none;
}

@media (min-width: 1024px) {
  .chevron-icon {
    display: block;
  }
}

.dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.5rem;
  width: 12rem;
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 50;
  transform-origin: top right;
  animation: dropdown-enter 0.1s ease-out;
}

.dark .dropdown {
  background: #1f2937;
  border-color: rgba(255, 255, 255, 0.1);
}

@keyframes dropdown-enter {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.dropdown-content {
  padding: 0.25rem 0;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #374151;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background: #f3f4f6;
}

.dark .dropdown-item {
  color: #d1d5db;
}

.dark .dropdown-item:hover {
  background: #374151;
}

.dropdown-button {
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}

.dropdown-divider {
  margin: 0.25rem 0;
  border: none;
  border-top: 1px solid #e5e7eb;
}

.dark .dropdown-divider {
  border-color: #4b5563;
}
</style>

<template>
  <div class="profile-page">
    <!-- Header -->
    <AppHeaderView @toggle-sidebar="toggleSidebar" />

    <!-- Sidebar -->
    <AppSidebarView :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Main Content -->
    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="container">
        <!-- Profile Header -->
        <div class="profile-header">
          <div class="avatar-section">
            <div class="avatar-container">
              <!-- <img :src="user?.avatar || '/user_icon.png'" :alt="user?.name" class="avatar" /> -->
              <img class="user-avatar" src="/user_icon.png" :alt="user?.name" />
              <button @click="openAvatarModal" class="avatar-edit">
                <CameraIcon class="icon" />
              </button>
            </div>
            <div class="user-info">
              <h1 class="user-name">{{ user?.name }}</h1>
              <p class="user-role">{{ user?.role || 'User' }}</p>
              <p class="user-email">{{ user?.email }}</p>
            </div>
          </div>

          <div class="profile-stats">
            <div class="stat-item">
              <span class="stat-value">{{ userStats.loginCount }}</span>
              <span class="stat-label">Total Logins</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ formatTimeAgo(user?.lastLogin) }}</span>
              <span class="stat-label">Last Login</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ formatDate(user?.createdAt) }}</span>
              <span class="stat-label">Member Since</span>
            </div>
          </div>
        </div>

        <!-- Profile Tabs -->
        <div class="profile-tabs">
          <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key" class="tab-button"
            :class="{ active: activeTab === tab.key }">
            <component :is="tab.icon" class="tab-icon" />
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Personal Information -->
          <div v-if="activeTab === 'personal'" class="tab-panel">
            <CardView title="Personal Information" class="profile-card">
              <ProfileForm />
            </CardView>
          </div>

          <!-- Security Settings -->
          <div v-if="activeTab === 'security'" class="tab-panel">
            <div class="security-grid">
              <CardView title="Password" class="security-card">
                <div class="security-item">
                  <div class="security-info">
                    <h4 class="security-title">Change Password</h4>
                    <p class="security-desc">Update your password to keep your account secure</p>
                  </div>
                  <button @click="showPasswordModal = true" class="security-btn">
                    Change
                  </button>
                </div>
              </CardView>

              <CardView title="Two-Factor Authentication" class="security-card">
                <div class="security-item">
                  <div class="security-info">
                    <h4 class="security-title">MFA Status</h4>
                    <p class="security-desc">
                      {{ user?.mfaEnabled ? 'Enabled' : 'Disabled' }} -
                      {{ user?.mfaEnabled ? 'Your account is protected' : 'Add extra security' }}
                    </p>
                  </div>
                  <button @click="toggleMFA" class="security-btn" :class="user?.mfaEnabled ? 'danger' : 'primary'">
                    {{ user?.mfaEnabled ? 'Disable' : 'Enable' }}
                  </button>
                </div>
              </CardView>

              <CardView title="Login Sessions" class="security-card">
                <div class="sessions-list">
                  <div v-for="session in sessions" :key="session.id" class="session-item">
                    <div class="session-info">
                      <div class="session-device">
                        <component :is="getDeviceIcon(session.device)" class="device-icon" />
                        <div>
                          <p class="session-name">{{ session.device }} - {{ session.browser }}</p>
                          <p class="session-location">{{ session.location }}</p>
                        </div>
                      </div>
                      <div class="session-meta">
                        <span class="session-current" v-if="session.current">Current</span>
                        <span class="session-time">{{ formatTimeAgo(session.lastActive) }}</span>
                      </div>
                    </div>
                    <button v-if="!session.current" @click="revokeSession(session.id)" class="revoke-btn">
                      Revoke
                    </button>
                  </div>
                </div>
              </CardView>
            </div>
          </div>

          <!-- Activity Log -->
          <div v-if="activeTab === 'activity'" class="tab-panel">
            <CardView title="Recent Activity" class="activity-card">
              <div class="activity-filters">
                <select v-model="activityFilter" class="filter-select">
                  <option value="all">All Activities</option>
                  <option value="login">Logins</option>
                  <option value="profile">Profile Changes</option>
                  <option value="security">Security Events</option>
                </select>
              </div>

              <div class="activity-list">
                <div v-for="activity in filteredActivity" :key="activity.id" class="activity-item">
                  <div class="activity-icon" :class="activity.type">
                    <component :is="getActivityIcon(activity.type)" class="icon" />
                  </div>
                  <div class="activity-content">
                    <p class="activity-text">{{ activity.description }}</p>
                    <div class="activity-meta">
                      <span class="activity-time">{{ formatTimeAgo(activity.timestamp) }}</span>
                      <span class="activity-ip">{{ activity.ipAddress }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardView>
          </div>

          <!-- Preferences -->
          <div v-if="activeTab === 'preferences'" class="tab-panel">
            <div class="preferences-grid">
              <CardView title="Notifications" class="pref-card">
                <div class="pref-section">
                  <div class="pref-item">
                    <div class="pref-info">
                      <h4 class="pref-title">Email Notifications</h4>
                      <p class="pref-desc">Receive important updates via email</p>
                    </div>
                    <label class="toggle-switch">
                      <input v-model="preferences.emailNotifications" type="checkbox" />
                      <span class="toggle-slider"></span>
                    </label>
                  </div>

                  <div class="pref-item">
                    <div class="pref-info">
                      <h4 class="pref-title">Push Notifications</h4>
                      <p class="pref-desc">Get browser notifications</p>
                    </div>
                    <label class="toggle-switch">
                      <input v-model="preferences.pushNotifications" type="checkbox" />
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </CardView>

              <CardView title="Appearance" class="pref-card">
                <div class="pref-section">
                  <div class="pref-item">
                    <div class="pref-info">
                      <h4 class="pref-title">Theme</h4>
                      <p class="pref-desc">Choose your preferred theme</p>
                    </div>
                    <select v-model="preferences.theme" class="pref-select">
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                </div>
              </CardView>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Avatar Upload Modal -->
    <ModalView :show="showAvatarModal" @close="showAvatarModal = false" title="Change Avatar">
      <div class="avatar-upload">
        <div class="current-avatar">
          <img :src="avatarPreview || user?.avatar || '/default-avatar.png'" alt="Avatar" class="preview-image" />
        </div>

        <div class="upload-controls">
          <input ref="fileInput" type="file" accept="image/*" @change="handleAvatarChange" class="file-input" />
          <button @click="$refs.fileInput.click()" class="upload-btn">
            <CloudArrowUpIcon class="icon" />
            Choose File
          </button>
          <p class="upload-note">JPG, PNG up to 2MB</p>
        </div>
      </div>

      <template #footer>
        <div class="modal-actions">
          <button @click="showAvatarModal = false" class="cancel-btn">Cancel</button>
          <button @click="saveAvatar" class="save-btn" :disabled="!avatarPreview">Save</button>
        </div>
      </template>
    </ModalView>

    <!-- Password Change Modal -->
    <ModalView :show="showPasswordModal" @close="showPasswordModal = false" title="Change Password">
      <form @submit.prevent="changePassword" class="password-form">
        <div class="form-group">
          <label class="form-label">Current Password</label>
          <input v-model="passwordForm.current" type="password" class="form-input" required />
        </div>

        <div class="form-group">
          <label class="form-label">New Password</label>
          <input v-model="passwordForm.new" type="password" class="form-input" required />
        </div>

        <div class="form-group">
          <label class="form-label">Confirm New Password</label>
          <input v-model="passwordForm.confirm" type="password" class="form-input" required />
        </div>
      </form>

      <template #footer>
        <div class="modal-actions">
          <button @click="showPasswordModal = false" class="cancel-btn">Cancel</button>
          <button @click="changePassword" class="save-btn">Update Password</button>
        </div>
      </template>
    </ModalView>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
// import { useTheme } from '@/composables/useTheme'
import AppHeaderView from '@/components/layout/AppHeaderView.vue'
import AppSidebarView from '@/components/layout/AppSidebarView.vue'
import CardView from '@/components/ui/CardView.vue'
import ModalView from '@/components/ui/ModalView.vue'
import ProfileForm from '@/components/forms/ProfileForm.vue'
import { formatTimeAgo, formatDate } from '@/utils/helpers'
import {
  UserIcon,
  ShieldCheckIcon,
  ClockIcon,
  CogIcon,
  CameraIcon,
  CloudArrowUpIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  LockClosedIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
// const { setTheme } = useTheme()

const sidebarOpen = ref(false)
const activeTab = ref('personal')
const showAvatarModal = ref(false)
const showPasswordModal = ref(false)
const avatarPreview = ref('')
const activityFilter = ref('all')

const user = computed(() => authStore.user)

const userStats = reactive({
  loginCount: 127,
  lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000)
})

const preferences = reactive({
  emailNotifications: true,
  pushNotifications: false,
  theme: 'system'
})

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

const tabs = [
  { key: 'personal', label: 'Personal Info', icon: UserIcon },
  { key: 'security', label: 'Security', icon: ShieldCheckIcon },
  { key: 'activity', label: 'Activity', icon: ClockIcon },
  { key: 'preferences', label: 'Preferences', icon: CogIcon }
]

const sessions = ref([
  {
    id: 1,
    device: 'MacBook Pro',
    browser: 'Chrome 120',
    location: 'New York, US',
    lastActive: new Date(),
    current: true
  },
  {
    id: 2,
    device: 'iPhone',
    browser: 'Safari Mobile',
    location: 'New York, US',
    lastActive: new Date(Date.now() - 30 * 60 * 1000),
    current: false
  }
])

const activities = ref([
  {
    id: 1,
    type: 'login',
    description: 'Signed in from Chrome on MacBook Pro',
    timestamp: new Date(),
    ipAddress: '192.168.1.100'
  },
  {
    id: 2,
    type: 'profile',
    description: 'Updated profile information',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    ipAddress: '192.168.1.100'
  },
  {
    id: 3,
    type: 'security',
    description: 'Changed password',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    ipAddress: '192.168.1.100'
  }
])

const filteredActivity = computed(() => {
  if (activityFilter.value === 'all') return activities.value
  return activities.value.filter(a => a.type === activityFilter.value)
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const openAvatarModal = () => {
  showAvatarModal.value = true
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const saveAvatar = async () => {
  // Save avatar logic
  showAvatarModal.value = false
  avatarPreview.value = ''
}

const changePassword = async () => {
  if (passwordForm.new !== passwordForm.confirm) {
    alert('Passwords do not match')
    return
  }
  // Change password logic
  showPasswordModal.value = false
  Object.assign(passwordForm, { current: '', new: '', confirm: '' })
}

const toggleMFA = () => {
  // Toggle MFA logic
}

const revokeSession = (id) => {
  const index = sessions.value.findIndex(s => s.id === id)
  if (index > -1) {
    sessions.value.splice(index, 1)
  }
}

const getDeviceIcon = (device) => {
  if (device.includes('iPhone') || device.includes('Android')) {
    return DevicePhoneMobileIcon
  }
  return ComputerDesktopIcon
}

const getActivityIcon = (type) => {
  const icons = {
    login: LockClosedIcon,
    profile: UserIcon,
    security: ShieldCheckIcon
  }
  return icons[type] || UserIcon
}

onMounted(() => {
  // Initialize preferences from user data
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f9fafb;
}

.dark .profile-page {
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

.profile-header {
  background: white;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.dark .profile-header {
  background: #1f2937;
  border-color: #374151;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e5e7eb;
}

.dark .avatar {
  border-color: #374151;
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 2rem;
  height: 2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.icon {
  width: 1rem;
  height: 1rem;
}

.user-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.dark .user-name {
  color: white;
}

.user-role {
  color: #3b82f6;
  font-weight: 500;
  margin: 0 0 0.25rem 0;
  text-transform: capitalize;
}

.user-email {
  color: #6b7280;
  margin: 0;
}

.dark .user-email {
  color: #9ca3af;
}

.profile-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.dark .stat-value {
  color: white;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .stat-label {
  color: #9ca3af;
}

.profile-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-button:hover {
  background: #f9fafb;
}

.tab-button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.dark .tab-button {
  background: #1f2937;
  border-color: #374151;
  color: #9ca3af;
}

.dark .tab-button:hover {
  background: #374151;
}

.dark .tab-button.active {
  background: #3b82f6;
  color: white;
}

.tab-icon {
  width: 1rem;
  height: 1rem;
}

.tab-content {
  min-height: 24rem;
}

.security-grid,
.preferences-grid {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .security-grid {
    grid-template-columns: 1fr 1fr;
  }

  .preferences-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .security-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.security-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.dark .security-title {
  color: white;
}

.security-desc {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.dark .security-desc {
  color: #9ca3af;
}

.security-btn {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.security-btn:hover {
  background: #2563eb;
}

.security-btn.danger {
  background: #ef4444;
}

.security-btn.danger:hover {
  background: #dc2626;
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.dark .session-item {
  border-color: #374151;
}

.session-device {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.device-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #6b7280;
}

.dark .device-icon {
  color: #9ca3af;
}

.session-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
  margin: 0;
}

.dark .session-name {
  color: white;
}

.session-location {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.dark .session-location {
  color: #9ca3af;
}

.session-current {
  font-size: 0.75rem;
  font-weight: 500;
  color: #10b981;
  background: #d1fae5;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.session-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.revoke-btn {
  padding: 0.375rem 0.75rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  cursor: pointer;
}

.revoke-btn:hover {
  background: #dc2626;
}

.activity-filters {
  margin-bottom: 1.5rem;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background: white;
  color: #1f2937;
}

.dark .filter-select {
  background: #374151;
  border-color: #4b5563;
  color: white;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.dark .activity-item {
  border-color: #374151;
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

.activity-icon.login {
  background: #dbeafe;
  color: #2563eb;
}

.activity-icon.profile {
  background: #d1fae5;
  color: #059669;
}

.activity-icon.security {
  background: #fef3c7;
  color: #d97706;
}

.activity-text {
  font-size: 0.875rem;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.dark .activity-text {
  color: white;
}

.activity-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.pref-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.pref-item:last-child {
  border-bottom: none;
}

.dark .pref-item {
  border-color: #374151;
}

.pref-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.dark .pref-title {
  color: white;
}

.pref-desc {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.dark .pref-desc {
  color: #9ca3af;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 3rem;
  height: 1.5rem;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #d1d5db;
  transition: 0.3s;
  border-radius: 1.5rem;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 1.25rem;
  width: 1.25rem;
  left: 0.125rem;
  bottom: 0.125rem;
  background: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked+.toggle-slider {
  background: #3b82f6;
}

input:checked+.toggle-slider:before {
  transform: translateX(1.5rem);
}

.pref-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background: white;
  color: #1f2937;
}

.dark .pref-select {
  background: #374151;
  border-color: #4b5563;
  color: white;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.preview-image {
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e5e7eb;
}

.dark .preview-image {
  border-color: #374151;
}

.upload-controls {
  text-align: center;
}

.file-input {
  display: none;
}

.upload-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin: 0 auto 0.5rem;
}

.upload-btn:hover {
  background: #2563eb;
}

.upload-note {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.dark .upload-note {
  color: #9ca3af;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.dark .form-label {
  color: #d1d5db;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #1f2937;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark .form-input {
  background: #374151;
  border-color: #4b5563;
  color: white;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.cancel-btn {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.dark .cancel-btn {
  background: #374151;
  color: #d1d5db;
  border-color: #4b5563;
}

.dark .cancel-btn:hover {
  background: #4b5563;
}

.save-btn {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}

.save-btn:hover:not(:disabled) {
  background: #2563eb;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

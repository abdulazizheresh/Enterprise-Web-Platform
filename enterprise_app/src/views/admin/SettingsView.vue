<template>
  <div class="settings-page">
    <AppHeaderView @toggle-sidebar="toggleSidebar" />
    <AppSidebarView :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="container">
        <!-- Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">System Settings</h1>
            <p class="page-subtitle">Configure system preferences and security settings</p>
          </div>
          <button @click="saveAllSettings" class="save-btn" :disabled="!hasChanges">
            <CheckIcon class="icon" />
            Save Changes
          </button>
        </div>

        <!-- Settings Tabs -->
        <div class="settings-tabs">
          <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key" class="tab-button"
            :class="{ active: activeTab === tab.key }">
            <component :is="tab.icon" class="tab-icon" />
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- General Settings -->
          <div v-if="activeTab === 'general'" class="tab-panel">
            <div class="settings-grid">
              <CardView title="Application Settings" class="settings-card">
                <div class="setting-item">
                  <div class="setting-info">
                    <h4 class="setting-title">Application Name</h4>
                    <p class="setting-desc">Display name for the application</p>
                  </div>
                  <input v-model="settings.general.appName" class="setting-input" />
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h4 class="setting-title">Company Name</h4>
                    <p class="setting-desc">Organization name displayed in footer</p>
                  </div>
                  <input v-model="settings.general.companyName" class="setting-input" />
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h4 class="setting-title">Default Theme</h4>
                    <p class="setting-desc">System-wide default theme</p>
                  </div>
                  <select v-model="settings.general.defaultTheme" class="setting-select">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h4 class="setting-title">Language</h4>
                    <p class="setting-desc">Default system language</p>
                  </div>
                  <select v-model="settings.general.language" class="setting-select">
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </CardView>

              <CardView title="System Maintenance" class="settings-card">
                <div class="setting-item">
                  <div class="setting-info">
                    <h4 class="setting-title">Maintenance Mode</h4>
                    <p class="setting-desc">Enable maintenance mode for system updates</p>
                  </div>
                  <label class="toggle-switch">
                    <input v-model="settings.general.maintenanceMode" type="checkbox" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h4 class="setting-title">Debug Mode</h4>
                    <p class="setting-desc">Enable detailed error logging</p>
                  </div>
                  <label class="toggle-switch">
                    <input v-model="settings.general.debugMode" type="checkbox" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </CardView>
            </div>
          </div>

          <!-- Security Settings -->
          <div v-if="activeTab === 'security'" class="tab-panel">
            <div class="settings-grid">
              <CardView title="Authentication" class="settings-card">
                <div class="setting-item">
                  <div class="setting-info">
                    <h4 class="setting-title">Password Policy</h4>
                    <p class="setting-desc">Minimum password requirements</p>
                  </div>
                  <div class="password-policy">
                    <label class="policy-item">
                      <input v-model="settings.security.passwordPolicy.minLength" type="number" min="6" max="32" />
                      <span>Minimum length</span>
                    </label>
                    <label class="policy-checkbox">
                      <input v-model="settings.security.passwordPolicy.requireUppercase" type="checkbox" />
                      <span>Require uppercase</span>
                    </label>
                    <label class="policy-checkbox">
                      <input v-model="settings.security.passwordPolicy.requireNumbers" type="checkbox" />
                      <span>Require numbers</span>
                    </label>
                    <label class="policy-checkbox">
                      <input v-model="settings.security.passwordPolicy.requireSymbols" type="checkbox" />
                      <span>Require symbols</span>
                    </label>
                  </div>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h4 class="setting-title">MFA Enforcement</h4>
                    <p class="setting-desc">Require multi-factor authentication</p>
                  </div>
                  <select v-model="settings.security.mfaEnforcement" class="setting-select">
                    <option value="optional">Optional</option>
                    <option value="admin">Admin Only</option>
                    <option value="required">All Users</option>
                  </select>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h4 class="setting-title">Session Timeout</h4>
                    <p class="setting-desc">Auto logout after inactivity (minutes)</p>
                  </div>
                  <input v-model="settings.security.sessionTimeout" type="number" min="5" max="1440"
                    class="setting-input" />
                </div>
              </CardView>

              <CardView title="Access Control" class="settings-card">
                <div class="setting-item">
                  <div class="setting-info">
                    <h4 class="setting-title">Failed Login Attempts</h4>
                    <p class="setting-desc">Max attempts before account lockout</p>
                  </div>
                  <input v-model="settings.security.maxLoginAttempts" type="number" min="3" max="10"
                    class="setting-input" />
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h4 class="setting-title">Account Lockout Duration</h4>
                    <p class="setting-desc">Lockout time in minutes</p>
                  </div>
                  <input v-model="settings.security.lockoutDuration" type="number" min="5" max="120"
                    class="setting-input" />
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h4 class="setting-title">IP Whitelist</h4>
                    <p class="setting-desc">Restrict access to specific IP addresses</p>
                  </div>
                  <textarea v-model="settings.security.ipWhitelist" placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                    class="setting-textarea"></textarea>
                </div>
              </CardView>
            </div>
          </div>

          <!-- Email Settings -->
          <div v-if="activeTab === 'email'" class="tab-panel">
            <CardView title="SMTP Configuration" class="settings-card">
              <div class="setting-item">
                <div class="setting-info">
                  <h4 class="setting-title">SMTP Server</h4>
                  <p class="setting-desc">Mail server hostname</p>
                </div>
                <input v-model="settings.email.smtpHost" placeholder="smtp.gmail.com" class="setting-input" />
              </div>

              <div class="setting-row">
                <div class="setting-item">
                  <div class="setting-info">
                    <h4 class="setting-title">Port</h4>
                    <p class="setting-desc">SMTP port</p>
                  </div>
                  <input v-model="settings.email.smtpPort" type="number" class="setting-input" />
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h4 class="setting-title">Encryption</h4>
                    <p class="setting-desc">Security method</p>
                  </div>
                  <select v-model="settings.email.encryption" class="setting-select">
                    <option value="none">None</option>
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                  </select>
                </div>
              </div>

              <div class="setting-row">
                <div class="setting-item">
                  <div class="setting-info">
                    <h4 class="setting-title">Username</h4>
                    <p class="setting-desc">SMTP username</p>
                  </div>
                  <input v-model="settings.email.username" class="setting-input" />
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h4 class="setting-title">Password</h4>
                    <p class="setting-desc">SMTP password</p>
                  </div>
                  <input v-model="settings.email.password" type="password" class="setting-input" />
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h4 class="setting-title">From Address</h4>
                  <p class="setting-desc">Default sender email</p>
                </div>
                <input v-model="settings.email.fromAddress" placeholder="noreply@company.com" class="setting-input" />
              </div>

              <div class="test-email">
                <button @click="testEmail" class="test-btn">
                  <PaperAirplaneIcon class="icon" />
                  Send Test Email
                </button>
              </div>
            </CardView>
          </div>

          <!-- API Settings -->
          <div v-if="activeTab === 'api'" class="tab-panel">
            <div class="settings-grid">
              <CardView title="Rate Limiting" class="settings-card">
                <div class="setting-item">
                  <div class="setting-info">
                    <h4 class="setting-title">Requests per Minute</h4>
                    <p class="setting-desc">Maximum API requests per minute</p>
                  </div>
                  <input v-model="settings.api.rateLimit" type="number" min="10" max="1000" class="setting-input" />
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h4 class="setting-title">Enable Rate Limiting</h4>
                    <p class="setting-desc">Apply rate limits to API endpoints</p>
                  </div>
                  <label class="toggle-switch">
                    <input v-model="settings.api.enableRateLimit" type="checkbox" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </CardView>

              <CardView title="API Keys" class="settings-card">
                <div class="api-keys">
                  <div v-for="key in apiKeys" :key="key.id" class="api-key-item">
                    <div class="key-info">
                      <p class="key-name">{{ key.name }}</p>
                      <p class="key-created">Created: {{ formatDate(key.createdAt) }}</p>
                    </div>
                    <div class="key-actions">
                      <button @click="revokeKey(key.id)" class="revoke-btn">
                        <TrashIcon class="icon" />
                        Revoke
                      </button>
                    </div>
                  </div>

                  <button @click="generateKey" class="generate-btn">
                    <PlusIcon class="icon" />
                    Generate New Key
                  </button>
                </div>
              </CardView>
            </div>
          </div>

          <!-- Database Settings -->
          <div v-if="activeTab === 'database'" class="tab-panel">
            <div class="settings-grid">
              <CardView title="Backup Configuration" class="settings-card">
                <div class="setting-item">
                  <div class="setting-info">
                    <h4 class="setting-title">Auto Backup</h4>
                    <p class="setting-desc">Enable automatic database backups</p>
                  </div>
                  <label class="toggle-switch">
                    <input v-model="settings.database.autoBackup" type="checkbox" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h4 class="setting-title">Backup Frequency</h4>
                    <p class="setting-desc">How often to create backups</p>
                  </div>
                  <select v-model="settings.database.backupFrequency" class="setting-select">
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h4 class="setting-title">Retention Period</h4>
                    <p class="setting-desc">Days to keep backups</p>
                  </div>
                  <input v-model="settings.database.retentionDays" type="number" min="7" max="365"
                    class="setting-input" />
                </div>
              </CardView>

              <CardView title="Database Actions" class="settings-card">
                <div class="db-actions">
                  <button @click="createBackup" class="action-btn primary">
                    <DocumentArrowDownIcon class="icon" />
                    Create Backup Now
                  </button>

                  <button @click="optimizeDatabase" class="action-btn secondary">
                    <WrenchScrewdriverIcon class="icon" />
                    Optimize Database
                  </button>

                  <button @click="showAnalytics" class="action-btn secondary">
                    <ChartBarIcon class="icon" />
                    View Analytics
                  </button>
                </div>
              </CardView>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import AppHeaderView from '@/components/layout/AppHeaderView.vue'
import AppSidebarView from '@/components/layout/AppSidebarView.vue'
import CardView from '@/components/ui/CardView.vue'
import { formatDate } from '@/utils/helpers'
import {
  CheckIcon,
  CogIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  CloudIcon,
  CircleStackIcon,
  PaperAirplaneIcon,
  TrashIcon,
  PlusIcon,
  DocumentArrowDownIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

const sidebarOpen = ref(false)
const activeTab = ref('general')
const hasChanges = ref(false)

const tabs = [
  { key: 'general', label: 'General', icon: CogIcon },
  { key: 'security', label: 'Security', icon: ShieldCheckIcon },
  { key: 'email', label: 'Email', icon: EnvelopeIcon },
  { key: 'api', label: 'API', icon: CloudIcon },
  { key: 'database', label: 'Database', icon: CircleStackIcon }
]

const settings = reactive({
  general: {
    appName: 'Enterprise Platform',
    companyName: 'Enterprise Corp',
    defaultTheme: 'system',
    language: 'en',
    maintenanceMode: false,
    debugMode: false
  },
  security: {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: true
    },
    mfaEnforcement: 'optional',
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    ipWhitelist: ''
  },
  email: {
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    encryption: 'tls',
    username: '',
    password: '',
    fromAddress: 'noreply@enterprise.com'
  },
  api: {
    rateLimit: 100,
    enableRateLimit: true
  },
  database: {
    autoBackup: true,
    backupFrequency: 'daily',
    retentionDays: 30
  }
})

const apiKeys = ref([
  {
    id: 1,
    name: 'Production API Key',
    createdAt: new Date('2023-01-15'),
    lastUsed: new Date()
  },
  {
    id: 2,
    name: 'Development API Key',
    createdAt: new Date('2023-02-20'),
    lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }
])

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const saveAllSettings = () => {
  console.log('Saving settings:', settings)
  hasChanges.value = false
}

const testEmail = () => {
  console.log('Testing email configuration')
}

const revokeKey = (id) => {
  const index = apiKeys.value.findIndex(k => k.id === id)
  if (index > -1) apiKeys.value.splice(index, 1)
}

const generateKey = () => {
  const newKey = {
    id: Date.now(),
    name: `API Key ${apiKeys.value.length + 1}`,
    createdAt: new Date(),
    lastUsed: null
  }
  apiKeys.value.push(newKey)
}

const createBackup = () => {
  console.log('Creating database backup')
}

const optimizeDatabase = () => {
  console.log('Optimizing database')
}

const showAnalytics = () => {
  console.log('Showing database analytics')
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: #f9fafb;
}

.dark .settings-page {
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

.save-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn:hover:not(:disabled) {
  background: #2563eb;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon {
  width: 1rem;
  height: 1rem;
}

.settings-tabs {
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

.settings-grid {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .settings-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.setting-item:last-child {
  border-bottom: none;
}

.dark .setting-item {
  border-color: #374151;
}

.setting-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.setting-info {
  flex: 1;
}

.setting-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.dark .setting-title {
  color: white;
}

.setting-desc {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.dark .setting-desc {
  color: #9ca3af;
}

.setting-input,
.setting-select {
  width: 12rem;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #1f2937;
}

.setting-textarea {
  width: 12rem;
  height: 4rem;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #1f2937;
  resize: vertical;
}

.dark .setting-input,
.dark .setting-select,
.dark .setting-textarea {
  background: #374151;
  border-color: #4b5563;
  color: white;
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

.password-policy {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 12rem;
}

.policy-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.policy-item input {
  width: 3rem;
}

.policy-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.test-email {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.dark .test-email {
  border-color: #374151;
}

.test-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}

.test-btn:hover {
  background: #059669;
}

.api-keys {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.api-key-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.dark .api-key-item {
  border-color: #374151;
}

.key-name {
  font-weight: 500;
  color: #1f2937;
  margin: 0;
}

.dark .key-name {
  color: white;
}

.key-created {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.dark .key-created {
  color: #9ca3af;
}

.revoke-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
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

.generate-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}

.generate-btn:hover {
  background: #2563eb;
}

.db-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
}

.action-btn.primary:hover {
  background: #2563eb;
}

.action-btn.secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.action-btn.secondary:hover {
  background: #e5e7eb;
}

.dark .action-btn.secondary {
  background: #374151;
  color: #d1d5db;
  border-color: #4b5563;
}

.dark .action-btn.secondary:hover {
  background: #4b5563;
}
</style>

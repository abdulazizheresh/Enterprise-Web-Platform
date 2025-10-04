<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Logo -->
      <div class="auth-logo">
        <img src="/logo.svg" alt="Enterprise Platform" class="logo" />
        <h1 class="logo-text">Enterprise Platform</h1>
      </div>

      <!-- MFA Form -->
      <div class="auth-card">
        <div class="card-header">
          <div class="security-icon">
            <ShieldCheckIcon class="icon-large" />
          </div>
          <h2 class="card-title">Multi-Factor Authentication</h2>
          <p class="card-description">
            Enter the 6-digit verification code from your authenticator app to complete login.
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <!-- MFA Code Input -->
          <div class="form-group">
            <label for="mfaCode" class="form-label">Verification Code</label>
            <input id="mfaCode" v-model="mfaCode" type="text" class="mfa-input" :class="{ 'error': errors.mfaCode }"
              placeholder="000000" maxlength="6" pattern="[0-9]{6}" autocomplete="one-time-code" @input="handleInput"
              required />
            <p v-if="errors.mfaCode" class="error-text">{{ errors.mfaCode }}</p>
            <p class="help-text">Check your authenticator app for the 6-digit code</p>
          </div>

          <!-- Time remaining -->
          <div v-if="timeRemaining > 0" class="time-remaining">
            <ClockIcon class="time-icon" />
            <span>Code expires in {{ formatTime(timeRemaining) }}</span>
          </div>

          <!-- Submit button -->
          <button type="submit" class="submit-btn" :disabled="loading || mfaCode.length !== 6">
            <div v-if="loading" class="loading-spinner"></div>
            {{ loading ? 'Verifying...' : 'Verify Code' }}
          </button>

          <!-- Error message -->
          <div v-if="errorMessage" class="error-alert">
            <ExclamationTriangleIcon class="alert-icon" />
            <p class="alert-text">{{ errorMessage }}</p>
          </div>

          <!-- Backup options -->
          <div class="backup-options">
            <button type="button" @click="requestBackupCode" class="backup-btn" :disabled="loading">
              Use backup code instead
            </button>
            <button type="button" @click="resendCode" class="backup-btn" :disabled="loading || resendCooldown > 0">
              {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code' }}
            </button>
          </div>

          <!-- Back to login -->
          <div class="auth-footer">
            <span class="footer-text">
              Having trouble?
              <router-link to="/auth/login" class="footer-link">Back to login</router-link>
            </span>
          </div>
        </form>
      </div>

      <!-- QR Code Modal (for setup) -->
      <div v-if="showQRCode" class="qr-modal">
        <div class="qr-content">
          <div class="qr-header">
            <h3 class="qr-title">Setup Authenticator App</h3>
            <button @click="showQRCode = false" class="close-btn">
              <XMarkIcon class="icon" />
            </button>
          </div>

          <div class="qr-body">
            <div class="qr-code">
              <img :src="qrCodeUrl" alt="QR Code" class="qr-image" />
            </div>

            <div class="qr-instructions">
              <h4 class="instruction-title">Scan with your authenticator app:</h4>
              <ol class="instruction-list">
                <li>Open your authenticator app (Google Authenticator, Authy, etc.)</li>
                <li>Tap "Add account" or "Scan QR code"</li>
                <li>Point your camera at this QR code</li>
                <li>Enter the 6-digit code below to verify</li>
              </ol>

              <div class="manual-code">
                <p class="manual-title">Can't scan? Enter this code manually:</p>
                <code class="manual-text">{{ manualCode }}</code>
                <button @click="copyCode" class="copy-btn">
                  <DocumentDuplicateIcon class="icon" />
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  ShieldCheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  DocumentDuplicateIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const mfaCode = ref('')
const errors = reactive({})
const loading = ref(false)
const errorMessage = ref('')
const timeRemaining = ref(30)
const resendCooldown = ref(0)
const showQRCode = ref(false)
const qrCodeUrl = ref('')
const manualCode = ref('')

let timer = null
let resendTimer = null

const handleInput = (event) => {
  // Only allow numbers
  const value = event.target.value.replace(/[^0-9]/g, '')
  mfaCode.value = value

  // Clear errors when typing
  if (errors.mfaCode) {
    delete errors.mfaCode
  }

  // Auto-submit when 6 digits entered
  if (value.length === 6) {
    handleSubmit()
  }
}

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key])

  if (!mfaCode.value) {
    errors.mfaCode = 'Verification code is required'
  } else if (mfaCode.value.length !== 6) {
    errors.mfaCode = 'Code must be 6 digits'
  } else if (!/^\d{6}$/.test(mfaCode.value)) {
    errors.mfaCode = 'Code must contain only numbers'
  }

  return Object.keys(errors).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.verifyMFA(mfaCode.value)
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.message || 'Invalid verification code. Please try again.'
    mfaCode.value = ''
  } finally {
    loading.value = false
  }
}

const requestBackupCode = () => {
  // This would typically show a modal for backup code entry
  console.log('Backup code requested')
}

const resendCode = async () => {
  if (resendCooldown.value > 0) return

  try {
    loading.value = true
    // Call API to resend code
    await authStore.resendMFA()

    // Start cooldown
    resendCooldown.value = 60
    resendTimer = setInterval(() => {
      resendCooldown.value--
      if (resendCooldown.value <= 0) {
        clearInterval(resendTimer)
      }
    }, 1000)

    // Reset time remaining
    timeRemaining.value = 30

  } catch (error) {
    errorMessage.value = 'Failed to resend code. Please try again.'
  } finally {
    loading.value = false
  }
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(manualCode.value)
  } catch (error) {
    console.error('Failed to copy code:', error)
  }
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const startTimer = () => {
  timer = setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

onMounted(() => {
  startTimer()

  // Check if this is MFA setup (new user)
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('setup') === 'true') {
    // Simulate QR code data (normally from API)
    showQRCode.value = true
    qrCodeUrl.value = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
    manualCode.value = 'JBSWY3DPEHPK3PXP'
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (resendTimer) clearInterval(resendTimer)
})
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.auth-container {
  width: 100%;
  max-width: 28rem;
}

.auth-logo {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  height: 3rem;
  width: 3rem;
  margin-bottom: 1rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin: 0;
}

.auth-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.dark .auth-card {
  background: #1f2937;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.security-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.icon-large {
  height: 3rem;
  width: 3rem;
  color: #10b981;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.dark .card-title {
  color: white;
}

.card-description {
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.dark .card-description {
  color: #9ca3af;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.mfa-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
  letter-spacing: 0.5rem;
  transition: all 0.2s ease;
  background: white;
  color: #1f2937;
}

.mfa-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.mfa-input.error {
  border-color: #ef4444;
}

.dark .mfa-input {
  background: #374151;
  border-color: #4b5563;
  color: white;
}

.dark .mfa-input:focus {
  border-color: #3b82f6;
}

.error-text {
  font-size: 0.875rem;
  color: #ef4444;
  margin: 0;
}

.help-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  text-align: center;
}

.dark .help-text {
  color: #9ca3af;
}

.time-remaining {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #f59e0b;
  font-size: 0.875rem;
  font-weight: 500;
}

.time-icon {
  height: 1rem;
  width: 1rem;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
}

.dark .error-alert {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
}

.alert-icon {
  height: 1.25rem;
  width: 1.25rem;
  color: #ef4444;
  flex-shrink: 0;
}

.alert-text {
  font-size: 0.875rem;
  color: #dc2626;
  margin: 0;
}

.dark .alert-text {
  color: #fca5a5;
}

.backup-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.backup-btn {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.backup-btn:hover:not(:disabled) {
  background: #f3f4f6;
}

.backup-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dark .backup-btn:hover:not(:disabled) {
  background: #374151;
}

.auth-footer {
  text-align: center;
}

.footer-text {
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .footer-text {
  color: #9ca3af;
}

.footer-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.footer-link:hover {
  text-decoration: underline;
}

/* QR Code Modal */
.qr-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.qr-content {
  background: white;
  border-radius: 1rem;
  max-width: 32rem;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.dark .qr-content {
  background: #1f2937;
}

.qr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0;
}

.qr-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.dark .qr-title {
  color: white;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
}

.dark .close-btn {
  color: #9ca3af;
}

.icon {
  height: 1.5rem;
  width: 1.5rem;
}

.qr-body {
  padding: 1.5rem;
}

.qr-code {
  text-align: center;
  margin-bottom: 1.5rem;
}

.qr-image {
  width: 12rem;
  height: 12rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.dark .qr-image {
  border-color: #4b5563;
}

.instruction-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.dark .instruction-title {
  color: white;
}

.instruction-list {
  margin: 0 0 1.5rem 0;
  padding-left: 1.25rem;
  color: #6b7280;
}

.dark .instruction-list {
  color: #9ca3af;
}

.instruction-list li {
  margin-bottom: 0.25rem;
}

.manual-code {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
}

.dark .manual-code {
  background: #374151;
  border-color: #4b5563;
}

.manual-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.dark .manual-title {
  color: #d1d5db;
}

.manual-text {
  display: block;
  font-family: monospace;
  font-size: 1rem;
  color: #1f2937;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  letter-spacing: 0.1rem;
}

.dark .manual-text {
  color: white;
  background: #1f2937;
  border-color: #4b5563;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: #2563eb;
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

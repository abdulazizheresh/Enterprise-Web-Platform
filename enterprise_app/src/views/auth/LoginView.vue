<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Logo -->
      <div class="auth-logo">
        <img src="/logo.svg" alt="Enterprise Platform" class="logo" />
        <h1 class="logo-text">Enterprise Platform</h1>
      </div>

      <!-- Login Form -->
      <div class="auth-card">
        <div class="card-header">
          <h2 class="card-title">Sign in to your account</h2>
          <p class="card-description">Welcome back! Please enter your details.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <!-- Username/Email -->
          <div class="form-group">
            <label for="username" class="form-label">Username or Email</label>
            <input id="username" v-model="form.username" type="text" class="form-input"
              :class="{ 'error': errors.username }" placeholder="Enter your username or email" required />
            <p v-if="errors.username" class="error-text">{{ errors.username }}</p>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <div class="password-input">
              <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" class="form-input"
                :class="{ 'error': errors.password }" placeholder="Enter your password" required />
              <button type="button" @click="showPassword = !showPassword" class="password-toggle">
                <EyeIcon v-if="!showPassword" class="icon" />
                <EyeSlashIcon v-else class="icon" />
              </button>
            </div>
            <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
          </div>

          <!-- MFA Token (if required) -->
          <div v-if="requiresMFA" class="form-group">
            <label for="mfaToken" class="form-label">MFA Code</label>
            <input id="mfaToken" v-model="form.mfaToken" type="text" class="form-input"
              :class="{ 'error': errors.mfaToken }" placeholder="Enter 6-digit code" maxlength="6" />
            <p v-if="errors.mfaToken" class="error-text">{{ errors.mfaToken }}</p>
            <p class="help-text">Enter the 6-digit code from your authenticator app</p>
          </div>

          <!-- Remember me & Forgot password -->
          <div class="form-options">
            <label class="checkbox-label">
              <input id="remember" v-model="form.remember" type="checkbox" class="checkbox" />
              <span class="checkbox-text">Remember me</span>
            </label>
            <router-link to="/auth/forgot-password" class="forgot-link">
              Forgot password?
            </router-link>
          </div>

          <!-- Submit button -->
          <button type="submit" class="submit-btn" :disabled="loading">
            <div v-if="loading" class="loading-spinner"></div>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>

          <!-- Error message -->
          <div v-if="errorMessage" class="error-alert">
            <ExclamationTriangleIcon class="alert-icon" />
            <p class="alert-text">{{ errorMessage }}</p>
          </div>

          <!-- Register link -->
          <div class="auth-footer">
            <span class="footer-text">
              Don't have an account?
              <router-link to="/auth/register" class="footer-link">Sign up</router-link>
            </span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { EyeIcon, EyeSlashIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  password: '',
  mfaToken: '',
  remember: false
})

const errors = reactive({})
const loading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)
const requiresMFA = ref(false)

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key])

  if (!form.username) {
    errors.username = 'Username or email is required'
  }

  if (!form.password) {
    errors.password = 'Password is required'
  }

  if (requiresMFA.value && !form.mfaToken) {
    errors.mfaToken = 'MFA code is required'
  }

  if (requiresMFA.value && form.mfaToken && form.mfaToken.length !== 6) {
    errors.mfaToken = 'MFA code must be 6 digits'
  }

  return Object.keys(errors).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  errorMessage.value = ''

  try {
    const result = await authStore.login({
      username: form.username,
      password: form.password,
      mfaToken: form.mfaToken || undefined
    })

    if (result.requiresMFA) {
      requiresMFA.value = true
      form.mfaToken = ''
    } else {
      router.push('/dashboard')
    }
  } catch (error) {
    errorMessage.value = error.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
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

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  color: #1f2937;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error {
  border-color: #ef4444;
}

.dark .form-input {
  background: #374151;
  border-color: #4b5563;
  color: white;
}

.dark .form-input:focus {
  border-color: #3b82f6;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
}

.dark .password-toggle {
  color: #9ca3af;
}

.icon {
  height: 1.25rem;
  width: 1.25rem;
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
}

.dark .help-text {
  color: #9ca3af;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
  accent-color: #3b82f6;
}

.checkbox-text {
  font-size: 0.875rem;
  color: #374151;
}

.dark .checkbox-text {
  color: #d1d5db;
}

.forgot-link {
  font-size: 0.875rem;
  color: #3b82f6;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
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

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>

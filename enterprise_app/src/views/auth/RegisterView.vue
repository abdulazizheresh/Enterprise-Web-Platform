<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Logo -->
      <div class="auth-logo">
        <img src="/logo.svg" alt="Enterprise Platform" class="logo" />
        <h1 class="logo-text">Enterprise Platform</h1>
      </div>

      <!-- Register Form -->
      <div class="auth-card">
        <div class="card-header">
          <h2 class="card-title">Create your account</h2>
          <p class="card-description">Join thousands of users already using our platform.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <!-- Full Name -->
          <div class="form-group">
            <label for="name" class="form-label">Full Name</label>
            <input id="name" v-model="form.name" type="text" class="form-input" :class="{ 'error': errors.name }"
              placeholder="Enter your full name" required />
            <p v-if="errors.name" class="error-text">{{ errors.name }}</p>
          </div>

          <!-- Username -->
          <div class="form-group">
            <label for="username" class="form-label">Username</label>
            <input id="username" v-model="form.username" type="text" class="form-input"
              :class="{ 'error': errors.username }" placeholder="Choose a username" required />
            <p v-if="errors.username" class="error-text">{{ errors.username }}</p>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <input id="email" v-model="form.email" type="email" class="form-input" :class="{ 'error': errors.email }"
              placeholder="Enter your email address" required />
            <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <div class="password-input">
              <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" class="form-input"
                :class="{ 'error': errors.password }" placeholder="Create a strong password" required />
              <button type="button" @click="showPassword = !showPassword" class="password-toggle">
                <EyeIcon v-if="!showPassword" class="icon" />
                <EyeSlashIcon v-else class="icon" />
              </button>
            </div>
            <p v-if="errors.password" class="error-text">{{ errors.password }}</p>

            <!-- Password strength indicator -->
            <div class="password-strength">
              <div class="strength-bar">
                <div class="strength-fill" :class="passwordStrengthClass" :style="{ width: passwordStrengthWidth }">
                </div>
              </div>
              <span class="strength-text">{{ passwordStrengthText }}</span>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <div class="password-input">
              <input id="confirmPassword" v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'" class="form-input"
                :class="{ 'error': errors.confirmPassword }" placeholder="Confirm your password" required />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="password-toggle">
                <EyeIcon v-if="!showConfirmPassword" class="icon" />
                <EyeSlashIcon v-else class="icon" />
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</p>
          </div>

          <!-- Terms and Privacy -->
          <div class="form-group">
            <label class="checkbox-label">
              <input id="terms" v-model="form.agreeToTerms" type="checkbox" class="checkbox" />
              <span class="checkbox-text">
                I agree to the
                <a href="/terms" class="link" target="_blank">Terms of Service</a>
                and
                <a href="/privacy" class="link" target="_blank">Privacy Policy</a>
              </span>
            </label>
            <p v-if="errors.agreeToTerms" class="error-text">{{ errors.agreeToTerms }}</p>
          </div>

          <!-- Submit button -->
          <button type="submit" class="submit-btn" :disabled="loading">
            <div v-if="loading" class="loading-spinner"></div>
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>

          <!-- Error message -->
          <div v-if="errorMessage" class="error-alert">
            <ExclamationTriangleIcon class="alert-icon" />
            <p class="alert-text">{{ errorMessage }}</p>
          </div>

          <!-- Login link -->
          <div class="auth-footer">
            <span class="footer-text">
              Already have an account?
              <router-link to="/auth/login" class="footer-link">Sign in</router-link>
            </span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { EyeIcon, EyeSlashIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
})

const errors = reactive({})
const loading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordStrength = computed(() => {
  const password = form.password
  if (!password) return 0

  let score = 0
  if (password.length >= 8) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++
  return score
})

const passwordStrengthText = computed(() => {
  const scores = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  return scores[passwordStrength.value] || 'Very Weak'
})

const passwordStrengthClass = computed(() => {
  const classes = ['very-weak', 'weak', 'fair', 'good', 'strong']
  return classes[passwordStrength.value] || 'very-weak'
})

const passwordStrengthWidth = computed(() => {
  return `${(passwordStrength.value / 5) * 100}%`
})

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key])

  if (!form.name) {
    errors.name = 'Full name is required'
  }

  if (!form.username) {
    errors.username = 'Username is required'
  } else if (form.username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
  } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
    errors.username = 'Username can only contain letters, numbers, and underscore'
  }

  if (!form.email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (!form.password) {
    errors.password = 'Password is required'
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
    errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  if (!form.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the terms and privacy policy'
  }

  return Object.keys(errors).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.register({
      name: form.name,
      username: form.username,
      email: form.email,
      password: form.password
    })

    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.message || 'Registration failed. Please try again.'
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
  max-height: 90vh;
  overflow-y: auto;
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

.password-strength {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.strength-bar {
  flex: 1;
  height: 0.25rem;
  background: #e5e7eb;
  border-radius: 0.125rem;
  overflow: hidden;
}

.dark .strength-bar {
  background: #4b5563;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
}

.strength-fill.very-weak {
  background: #ef4444;
}

.strength-fill.weak {
  background: #f97316;
}

.strength-fill.fair {
  background: #eab308;
}

.strength-fill.good {
  background: #22c55e;
}

.strength-fill.strong {
  background: #16a34a;
}

.strength-text {
  font-size: 0.75rem;
  color: #6b7280;
  white-space: nowrap;
}

.dark .strength-text {
  color: #9ca3af;
}

.error-text {
  font-size: 0.875rem;
  color: #ef4444;
  margin: 0;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
  accent-color: #3b82f6;
  margin-top: 0.125rem;
}

.checkbox-text {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.4;
}

.dark .checkbox-text {
  color: #d1d5db;
}

.link {
  color: #3b82f6;
  text-decoration: none;
}

.link:hover {
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

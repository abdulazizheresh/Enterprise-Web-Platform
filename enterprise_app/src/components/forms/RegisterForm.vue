<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Full Name -->
    <div>
      <label for="name" class="form-label">
        Full Name
      </label>
      <input id="name" v-model="form.name" type="text" class="form-input" :class="{ 'border-red-500': errors.name }"
        placeholder="Enter your full name" required />
      <p v-if="errors.name" class="form-error">{{ errors.name }}</p>
    </div>

    <!-- Username -->
    <div>
      <label for="username" class="form-label">
        Username
      </label>
      <input id="username" v-model="form.username" type="text" class="form-input"
        :class="{ 'border-red-500': errors.username }" placeholder="Choose a username" required />
      <p v-if="errors.username" class="form-error">{{ errors.username }}</p>
    </div>

    <!-- Email -->
    <div>
      <label for="email" class="form-label">
        Email Address
      </label>
      <input id="email" v-model="form.email" type="email" class="form-input" :class="{ 'border-red-500': errors.email }"
        placeholder="Enter your email address" required />
      <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
    </div>

    <!-- Password -->
    <div>
      <label for="password" class="form-label">
        Password
      </label>
      <div class="relative">
        <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" class="form-input pr-10"
          :class="{ 'border-red-500': errors.password }" placeholder="Create a strong password" required />
        <button type="button" @click="showPassword = !showPassword"
          class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
          <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
        </button>
      </div>
      <p v-if="errors.password" class="form-error">{{ errors.password }}</p>

      <!-- Password strength indicator -->
      <div class="mt-2">
        <div class="flex items-center space-x-1">
          <div class="flex-1 h-1 bg-gray-200 rounded">
            <div :class="passwordStrengthClass" class="h-1 rounded transition-all duration-300"
              :style="{ width: passwordStrengthWidth }"></div>
          </div>
          <span class="text-xs text-gray-600 dark:text-gray-400">
            {{ passwordStrengthText }}
          </span>
        </div>
      </div>
    </div>

    <!-- Confirm Password -->
    <div>
      <label for="confirmPassword" class="form-label">
        Confirm Password
      </label>
      <div class="relative">
        <input id="confirmPassword" v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
          class="form-input pr-10" :class="{ 'border-red-500': errors.confirmPassword }"
          placeholder="Confirm your password" required />
        <button type="button" @click="showConfirmPassword = !showConfirmPassword"
          class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <EyeIcon v-if="!showConfirmPassword" class="h-5 w-5 text-gray-400" />
          <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
        </button>
      </div>
      <p v-if="errors.confirmPassword" class="form-error">{{ errors.confirmPassword }}</p>
    </div>

    <!-- Terms and Privacy -->
    <div>
      <div class="flex items-start">
        <input id="terms" v-model="form.agreeToTerms" type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1" />
        <label for="terms" class="ml-2 text-sm text-gray-900 dark:text-gray-300">
          I agree to the
          <a href="/terms" class="text-primary-600 hover:text-primary-500" target="_blank">
            Terms of Service
          </a>
          and
          <a href="/privacy" class="text-primary-600 hover:text-primary-500" target="_blank">
            Privacy Policy
          </a>
        </label>
      </div>
      <p v-if="errors.agreeToTerms" class="form-error">{{ errors.agreeToTerms }}</p>
    </div>

    <!-- Submit button -->
    <ButtonView type="submit" variant="primary" :loading="loading" loadingText="Creating account..." block>
      Create Account
    </ButtonView>

    <!-- Error message -->
    <div v-if="errorMessage" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
      <div class="flex">
        <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
        <div class="ml-3">
          <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
        </div>
      </div>
    </div>

    <!-- Login link -->
    <div class="text-center">
      <span class="text-sm text-gray-600 dark:text-gray-400">
        Already have an account?
        <router-link to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500">
          Sign in
        </router-link>
      </span>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ButtonView from '@/components/ui/ButtonView.vue'
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
  const classes = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500'
  ]
  return classes[passwordStrength.value] || 'bg-red-500'
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

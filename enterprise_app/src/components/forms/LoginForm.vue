<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Username/Email -->
    <div>
      <label for="username" class="form-label">
        Username or Email
      </label>
      <input id="username" v-model="form.username" type="text" class="form-input"
        :class="{ 'border-red-500': errors.username }" placeholder="Enter your username or email" required />
      <p v-if="errors.username" class="form-error">{{ errors.username }}</p>
    </div>

    <!-- Password -->
    <div>
      <label for="password" class="form-label">
        Password
      </label>
      <div class="relative">
        <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" class="form-input pr-10"
          :class="{ 'border-red-500': errors.password }" placeholder="Enter your password" required />
        <button type="button" @click="showPassword = !showPassword"
          class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
          <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
        </button>
      </div>
      <p v-if="errors.password" class="form-error">{{ errors.password }}</p>
    </div>

    <!-- MFA Token (if required) -->
    <div v-if="requiresMFA">
      <label for="mfaToken" class="form-label">
        MFA Code
      </label>
      <input id="mfaToken" v-model="form.mfaToken" type="text" class="form-input"
        :class="{ 'border-red-500': errors.mfaToken }" placeholder="Enter 6-digit code" maxlength="6" />
      <p v-if="errors.mfaToken" class="form-error">{{ errors.mfaToken }}</p>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
        Enter the 6-digit code from your authenticator app
      </p>
    </div>

    <!-- Remember me -->
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input id="remember" v-model="form.remember" type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
        <label for="remember" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
          Remember me
        </label>
      </div>
      <router-link to="/auth/forgot-password" class="text-sm text-primary-600 hover:text-primary-500">
        Forgot password?
      </router-link>
    </div>

    <!-- Submit button -->
    <ButtonView type="submit" variant="primary" :loading="loading" loadingText="Signing in..." block>
      Sign In
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

    <!-- Register link -->
    <div class="text-center">
      <span class="text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?
        <router-link to="/auth/register" class="font-medium text-primary-600 hover:text-primary-500">
          Sign up
        </router-link>
      </span>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ButtonView from '@/components/ui/ButtonView.vue'
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

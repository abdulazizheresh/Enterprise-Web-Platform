<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Avatar Upload -->
    <div>
      <label class="form-label">Profile Picture</label>
      <div class="flex items-center space-x-6">
        <div class="flex-shrink-0">
          <img :src="avatarPreview || user?.avatar || '/default-avatar.png'" :alt="user?.name"
            class="h-20 w-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600" />
        </div>
        <div>
          <input ref="fileInput" type="file" accept="image/*" @change="handleAvatarChange" class="hidden" />
          <ButtonView variant="outline" size="sm" @click="$refs.fileInput.click()">
            Change Picture
          </ButtonView>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            JPG, PNG up to 2MB
          </p>
        </div>
      </div>
    </div>

    <!-- Personal Information -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Full Name -->
      <div>
        <label for="name" class="form-label">
          Full Name
        </label>
        <input id="name" v-model="form.name" type="text" class="form-input" :class="{ 'border-red-500': errors.name }"
          placeholder="Enter your full name" />
        <p v-if="errors.name" class="form-error">{{ errors.name }}</p>
      </div>

      <!-- Username -->
      <div>
        <label for="username" class="form-label">
          Username
        </label>
        <input id="username" v-model="form.username" type="text" class="form-input"
          :class="{ 'border-red-500': errors.username }" placeholder="Your username" />
        <p v-if="errors.username" class="form-error">{{ errors.username }}</p>
      </div>
    </div>

    <!-- Email -->
    <div>
      <label for="email" class="form-label">
        Email Address
      </label>
      <input id="email" v-model="form.email" type="email" class="form-input" :class="{ 'border-red-500': errors.email }"
        placeholder="your.email@example.com" />
      <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
    </div>

    <!-- Bio -->
    <div>
      <label for="bio" class="form-label">
        Bio
      </label>
      <textarea id="bio" v-model="form.bio" rows="4" class="form-input"
        placeholder="Tell us about yourself..."></textarea>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {{ form.bio?.length || 0 }}/500 characters
      </p>
    </div>

    <!-- Contact Information -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Phone -->
      <div>
        <label for="phone" class="form-label">
          Phone Number
        </label>
        <input id="phone" v-model="form.phone" type="tel" class="form-input" placeholder="+1 (555) 123-4567" />
      </div>

      <!-- Location -->
      <div>
        <label for="location" class="form-label">
          Location
        </label>
        <input id="location" v-model="form.location" type="text" class="form-input" placeholder="City, Country" />
      </div>
    </div>

    <!-- Preferences -->
    <div class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
        Preferences
      </h3>

      <!-- Email Notifications -->
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">
            Email Notifications
          </h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Receive email notifications about activity
          </p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="form.emailNotifications" type="checkbox" class="sr-only peer" />
          <div
            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600">
          </div>
        </label>
      </div>

      <!-- Push Notifications -->
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">
            Push Notifications
          </h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Receive push notifications in your browser
          </p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="form.pushNotifications" type="checkbox" class="sr-only peer" />
          <div
            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600">
          </div>
        </label>
      </div>

      <!-- Dark Mode -->
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">
            Dark Mode
          </h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Use dark theme interface
          </p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="form.darkMode" type="checkbox" class="sr-only peer" />
          <div
            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600">
          </div>
        </label>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="flex justify-end space-x-3">
      <ButtonView variant="outline" @click="resetForm" :disabled="loading">
        Reset
      </ButtonView>
      <ButtonView type="submit" variant="primary" :loading="loading" loadingText="Saving...">
        Save Changes
      </ButtonView>
    </div>

    <!-- Success message -->
    <div v-if="successMessage" class="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
      <div class="flex">
        <CheckCircleIcon class="h-5 w-5 text-green-400" />
        <div class="ml-3">
          <p class="text-sm text-green-800 dark:text-green-200">{{ successMessage }}</p>
        </div>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
      <div class="flex">
        <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
        <div class="ml-3">
          <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'
import ButtonView from '@/components/ui/ButtonView.vue'
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const { isDarkMode, toggleTheme } = useTheme()

const form = reactive({
  name: '',
  username: '',
  email: '',
  bio: '',
  phone: '',
  location: '',
  emailNotifications: true,
  pushNotifications: false,
  darkMode: false
})

const errors = reactive({})
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const avatarPreview = ref('')

const user = computed(() => authStore.user)

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key])

  if (!form.name) {
    errors.name = 'Name is required'
  }

  if (!form.username) {
    errors.username = 'Username is required'
  } else if (form.username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
  }

  if (!form.email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (form.bio && form.bio.length > 500) {
    errors.bio = 'Bio must be less than 500 characters'
  }

  return Object.keys(errors).length === 0
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      errorMessage.value = 'File size must be less than 2MB'
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const resetForm = () => {
  if (user.value) {
    Object.assign(form, {
      name: user.value.name || '',
      username: user.value.username || '',
      email: user.value.email || '',
      bio: user.value.bio || '',
      phone: user.value.phone || '',
      location: user.value.location || '',
      emailNotifications: user.value.emailNotifications ?? true,
      pushNotifications: user.value.pushNotifications ?? false,
      darkMode: isDarkMode.value
    })
  }
  avatarPreview.value = ''
  Object.keys(errors).forEach(key => delete errors[key])
  successMessage.value = ''
  errorMessage.value = ''
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    // Handle dark mode toggle
    if (form.darkMode !== isDarkMode.value) {
      toggleTheme()
    }

    await authStore.updateProfile({
      name: form.name,
      username: form.username,
      email: form.email,
      bio: form.bio,
      phone: form.phone,
      location: form.location,
      emailNotifications: form.emailNotifications,
      pushNotifications: form.pushNotifications,
      avatar: avatarPreview.value
    })

    successMessage.value = 'Profile updated successfully!'

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)

  } catch (error) {
    errorMessage.value = error.message || 'Failed to update profile. Please try again.'
  } finally {
    loading.value = false
  }
}

// Initialize form with user data
onMounted(() => {
  resetForm()
})
</script>

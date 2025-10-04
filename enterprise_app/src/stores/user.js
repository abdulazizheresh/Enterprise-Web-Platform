import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import userService from '@/services/user.service'

export const useUserStore = defineStore('user', () => {
  // State
  const profile = ref(null)
  const preferences = ref({
    theme: 'system',
    language: 'en',
    timezone: 'UTC',
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true
  })
  const activityLog = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const fullName = computed(() => profile.value?.name || '')
  const initials = computed(() => {
    if (!profile.value?.name) return 'U'
    return profile.value.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  })

  const avatar = computed(() =>
    profile.value?.avatar || `/api/avatar/${profile.value?.username || 'default'}`
  )

  const isProfileComplete = computed(() => {
    if (!profile.value) return false
    const required = ['name', 'email', 'username']
    return required.every(field => profile.value[field])
  })

  // Actions
  const fetchProfile = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await userService.getProfile()
      profile.value = response.user
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (data) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await userService.updateProfile(data)
      profile.value = response.user
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const uploadAvatar = async (file) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await userService.uploadAvatar(file)
      if (profile.value) {
        profile.value.avatar = response.avatar
      }
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updatePreferences = async (newPreferences) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await userService.updatePreferences(newPreferences)
      preferences.value = { ...preferences.value, ...newPreferences }
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchActivityLog = async (limit = 50) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await userService.getActivityLog(limit)
      activityLog.value = response.activities
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await userService.changePassword({
        currentPassword,
        newPassword
      })
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const enableMFA = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await userService.enableMFA()
      if (profile.value) {
        profile.value.mfaEnabled = true
      }
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const disableMFA = async (password) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await userService.disableMFA(password)
      if (profile.value) {
        profile.value.mfaEnabled = false
      }
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteAccount = async (password) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await userService.deleteAccount(password)
      // Clear all user data
      profile.value = null
      preferences.value = {}
      activityLog.value = []
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    profile,
    preferences,
    activityLog,
    isLoading,
    error,

    // Getters
    fullName,
    initials,
    avatar,
    isProfileComplete,

    // Actions
    fetchProfile,
    updateProfile,
    uploadAvatar,
    updatePreferences,
    fetchActivityLog,
    changePassword,
    enableMFA,
    disableMFA,
    deleteAccount,
    clearError
  }
})

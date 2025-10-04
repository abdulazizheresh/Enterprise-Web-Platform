import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/auth.service'
// import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isLoading = ref(false)
  const isInitialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || 'user')
  const isAdmin = computed(() => userRole.value === 'admin')

  // Actions
  const login = async (credentials) => {
    isLoading.value = true
    try {
      const response = await authService.login(credentials)

      if (response.requiresMFA) {
        return { requiresMFA: true }
      }

      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)

      return response
      // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData) => {
    isLoading.value = true
    try {
      const response = await authService.register(userData)

      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)

      return response
      // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
      isLoading.value = false
    }
  }

  const initializeAuth = async () => {
    if (isInitialized.value) return

    const storedToken = localStorage.getItem('token')
    if (!storedToken) {
      isInitialized.value = true
      return
    }

    isLoading.value = true
    try {
      const userData = await authService.getProfile()
      user.value = userData.user
      token.value = storedToken
    } catch (error) {
      console.error('Auth initialization failed:', error)
      logout()
    } finally {
      isLoading.value = false
      isInitialized.value = true
    }
  }

  const updateProfile = async (profileData) => {
    isLoading.value = true
    try {
      const response = await authService.updateProfile(profileData)
      user.value = response.user
      return response
      // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const setupMFA = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await authService.setupMFA()
      return response
    } catch (error) {
      throw error
    }
  }

  const verifyMFA = async (token) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await authService.verifyMFA(token)
      return response
    } catch (error) {
      throw error
    }
  }

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken()
      token.value = response.token
      localStorage.setItem('token', response.token)
      return response
    } catch (error) {
      logout()
      throw error
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    isInitialized,

    // Getters
    isAuthenticated,
    userRole,
    isAdmin,

    // Actions
    login,
    register,
    logout,
    initializeAuth,
    updateProfile,
    setupMFA,
    verifyMFA,
    refreshToken
  }
})

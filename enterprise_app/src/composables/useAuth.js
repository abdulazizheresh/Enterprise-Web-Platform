import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isLoading = computed(() => authStore.isLoading)
  const token = computed(() => authStore.token)

  const login = async (credentials) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await authStore.login(credentials)
      if (!result.requiresMFA) {
        router.push('/dashboard')
      }
      return result
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      await authStore.register(userData)
      router.push('/dashboard')
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    await authStore.logout()
    router.push('/auth/login')
  }

  const requireAuth = () => {
    if (!isAuthenticated.value) {
      router.push('/auth/login')
      return false
    }
    return true
  }

  const requireRole = (role) => {
    if (!isAuthenticated.value || authStore.userRole !== role) {
      router.push('/unauthorized')
      return false
    }
    return true
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    token,
    login,
    register,
    logout,
    requireAuth,
    requireRole
  }
}

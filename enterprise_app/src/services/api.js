import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://4.248.248.213/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()

    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  async (error) => {
    const authStore = useAuthStore()

    if (error.response?.status === 401) {
      // Token expired or invalid
      authStore.logout()
      window.location.href = '/auth/login'
    }

    if (error.response?.status === 429) {
      // Rate limited
      throw new Error('Too many requests. Please try again later.')
    }

    if (error.response?.status >= 500) {
      // Server error
      throw new Error('Server error. Please try again later.')
    }

    throw new Error(error.response?.data?.message || error.message || 'An error occurred')
  }
)

export default api

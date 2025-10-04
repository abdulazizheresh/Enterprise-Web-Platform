import socketService from '@/services/socket.service'
import { useAuthStore } from '@/stores/auth'
import { useSocketStore } from '@/stores/socket'

const socketPlugin = {
  install(app) {
    // Make socket service available globally
    app.config.globalProperties.$socket = socketService
    app.provide('socket', socketService)

    // Auto-connect when user is authenticated
    const authStore = useAuthStore()
    const socketStore = useSocketStore()

    // Watch for auth changes
    authStore.$subscribe((mutation, state) => {
      if (state.isAuthenticated && state.token) {
        // Connect socket when user logs in
        socketService.connect(state.token)
        socketStore.connect()
      } else {
        // Disconnect when user logs out
        socketService.disconnect()
        socketStore.disconnect()
      }
    })
  }
}

export default socketPlugin

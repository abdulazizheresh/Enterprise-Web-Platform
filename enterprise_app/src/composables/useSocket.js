import { computed, onMounted, onUnmounted } from 'vue'
import { useSocketStore } from '@/stores/socket'
import { useAuthStore } from '@/stores/auth'

export function useSocket() {
  const socketStore = useSocketStore()
  const authStore = useAuthStore()

  const isConnected = computed(() => socketStore.isConnected)
  const connectionStatus = computed(() => socketStore.connectionStatus)
  const onlineUsers = computed(() => socketStore.onlineUsers)
  const events = computed(() => socketStore.events)

  const connect = () => {
    if (authStore.isAuthenticated) {
      socketStore.connect()
    }
  }

  const disconnect = () => {
    socketStore.disconnect()
  }

  const emit = (event, data) => {
    socketStore.emit(event, data)
  }

  const joinRoom = (roomId) => {
    socketStore.joinRoom(roomId)
  }

  const leaveRoom = (roomId) => {
    socketStore.leaveRoom(roomId)
  }

  onMounted(() => {
    if (authStore.isAuthenticated) {
      connect()
    }
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected,
    connectionStatus,
    onlineUsers,
    events,
    connect,
    disconnect,
    emit,
    joinRoom,
    leaveRoom
  }
}

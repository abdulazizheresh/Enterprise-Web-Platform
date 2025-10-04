import { computed, onMounted } from 'vue'
import { useNotificationsStore } from '@/stores/notifications'
import { useToast } from 'vue-toastification'

export function useNotifications() {
  const notificationsStore = useNotificationsStore()
  const toast = useToast()

  const notifications = computed(() => notificationsStore.notifications)
  const unreadCount = computed(() => notificationsStore.unreadCount)
  const recentNotifications = computed(() => notificationsStore.recentNotifications)
  const isLoading = computed(() => notificationsStore.isLoading)

  const fetchNotifications = async () => {
    try {
      await notificationsStore.fetchNotifications()
    } catch {
      toast.error('Failed to load notifications')
    }
  }

  const markAsRead = async (id) => {
    try {
      await notificationsStore.markAsRead(id)
    } catch {
      toast.error('Failed to mark notification as read')
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationsStore.markAllAsRead()
      toast.success('All notifications marked as read')
    } catch {
      toast.error('Failed to mark notifications as read')
    }
  }

  const deleteNotification = async (id) => {
    try {
      await notificationsStore.deleteNotification(id)
      toast.success('Notification deleted')
    } catch {
      toast.error('Failed to delete notification')
    }
  }

  const showToast = (notification) => {
    const toastConfig = {
      timeout: 5000,
      closeOnClick: true,
      pauseOnHover: true
    }

    switch (notification.type) {
      case 'success':
        toast.success(notification.message, toastConfig)
        break
      case 'error':
        toast.error(notification.message, toastConfig)
        break
      case 'warning':
        toast.warning(notification.message, toastConfig)
        break
      case 'info':
      default:
        toast.info(notification.message, toastConfig)
        break
    }
  }

  const addNotification = (notification) => {
    notificationsStore.addNotification(notification)
    showToast(notification)
  }

  onMounted(() => {
    fetchNotifications()
  })

  return {
    notifications,
    unreadCount,
    recentNotifications,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    showToast
  }
}

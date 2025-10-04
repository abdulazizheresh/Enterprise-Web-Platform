<template>
  <div id="app" :class="{ 'dark': isDarkMode }">
    <!-- Loading overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <LoadingView />
    </div>

    <!-- Main application -->
    <div class="app-container">
      <router-view />
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useTheme } from './composables/useTheme'
import LoadingView from './components/ui/LoadingView.vue'

const authStore = useAuthStore()
const router = useRouter()
const { isDarkMode } = useTheme()

const isLoading = computed(() => authStore.isLoading)

const publicRoutes = ['/', '/auth/login', '/auth/register']

onMounted(async () => {
  await authStore.initializeAuth()

  const currentPath = router.currentRoute.value.path

  if (authStore.isAuthenticated && currentPath.startsWith('/auth')) {
    router.push('/dashboard')
  } else if (!authStore.isAuthenticated && !publicRoutes.includes(currentPath)) {
    router.push('/auth/login')
  }
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.5);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-container {
  min-height: 100vh;
  background: #f9fafb;
  transition: all 0.3s ease;
}

.dark .app-container {
  background: #111827;
}
</style>

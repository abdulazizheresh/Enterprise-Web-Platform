<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-6">
        <!-- Main footer content -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Company info -->
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center mb-4">
              <img class="h-8 w-8" src="/logo.svg" alt="Enterprise" />
              <span class="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                Enterprise Platform
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 max-w-md">
              Modern cloud-native enterprise platform built with Vue.js and Node.js.
              Featuring real-time monitoring, advanced security, and scalable architecture.
            </p>
            <div class="mt-4 flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span class="sr-only">GitHub</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span class="sr-only">Documentation</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Quick links -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul class="space-y-2">
              <li>
                <router-link to="/dashboard"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Dashboard
                </router-link>
              </li>
              <li>
                <router-link to="/analytics"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Analytics
                </router-link>
              </li>
              <li>
                <router-link to="/health"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Health Monitor
                </router-link>
              </li>
              <li>
                <a href="/api/health" target="_blank"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  API Status
                </a>
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul class="space-y-2">
              <li>
                <a href="#" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom section -->
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <!-- Copyright -->
            <div class="text-sm text-gray-500 dark:text-gray-400">
              &copy; {{ currentYear }} Enterprise Platform. Built with Vue.js & Azure.
            </div>

            <!-- System info -->
            <div class="mt-4 md:mt-0 flex items-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
              <div class="flex items-center">
                <div class="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                System Operational
              </div>
              <div>
                Uptime: {{ systemUptime }}
              </div>
              <div>
                Version: {{ appVersion }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'

// Stores
const dashboardStore = useDashboardStore()

// State
const currentYear = new Date().getFullYear()
const appVersion = ref('1.0.0')
const uptimeInterval = ref(null)

// Computed
const systemUptime = computed(() => {
  const stats = dashboardStore.stats
  if (!stats?.systemUptime) return '0s'

  const uptime = Math.floor(stats.systemUptime)
  const days = Math.floor(uptime / 86400)
  const hours = Math.floor((uptime % 86400) / 3600)
  const minutes = Math.floor((uptime % 3600) / 60)

  if (days > 0) {
    return `${days}d ${hours}h`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
})

// Lifecycle
onMounted(() => {
  // Update uptime periodically
  uptimeInterval.value = setInterval(() => {
    dashboardStore.fetchStats()
  }, 60000) // Update every minute
})

onUnmounted(() => {
  if (uptimeInterval.value) {
    clearInterval(uptimeInterval.value)
  }
})
</script>

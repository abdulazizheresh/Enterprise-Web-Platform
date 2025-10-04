<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-content">
        <div class="error-icon">
          <component :is="errorConfig.icon" class="icon" />
        </div>

        <div class="error-info">
          <h1 class="error-code">{{ errorConfig.code }}</h1>
          <h2 class="error-title">{{ errorConfig.title }}</h2>
          <p class="error-description">{{ errorConfig.description }}</p>
        </div>

        <div class="error-actions">
          <button @click="goBack" class="action-btn primary">
            <ArrowLeftIcon class="icon" />
            Go Back
          </button>
          <router-link to="/" class="action-btn secondary">
            <HomeIcon class="icon" />
            Home
          </router-link>
          <button v-if="showRefresh" @click="refreshPage" class="action-btn secondary">
            <ArrowPathIcon class="icon" />
            Refresh
          </button>
        </div>

        <div v-if="showDetails" class="error-details">
          <details class="details-section">
            <summary class="details-summary">Technical Details</summary>
            <div class="details-content">
              <p><strong>Timestamp:</strong> {{ new Date().toISOString() }}</p>
              <p><strong>User Agent:</strong> {{ navigator.userAgent }}</p>
              <p><strong>URL:</strong> {{ currentUrl }}</p>
              <p v-if="errorMessage"><strong>Error:</strong> {{ errorMessage }}</p>
            </div>
          </details>
        </div>
      </div>

      <div class="error-illustration">
        <div class="illustration" :class="errorType">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  WifiIcon,
  ServerIcon,
  ArrowLeftIcon,
  HomeIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

// const route = useRoute()
const router = useRouter()

const props = defineProps({
  error: {
    type: String,
    default: 'notFound'
  },
  message: {
    type: String,
    default: ''
  }
})

const errorType = computed(() => props.error)
const currentUrl = computed(() => window.location.href)
const errorMessage = computed(() => props.message)

const errorConfigs = {
  notFound: {
    code: '404',
    title: 'Page Not Found',
    description: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
    icon: ExclamationTriangleIcon,
    showRefresh: false
  },
  unauthorized: {
    code: '403',
    title: 'Access Denied',
    description: 'You do not have permission to access this resource. Please contact an administrator if you believe this is an error.',
    icon: ShieldExclamationIcon,
    showRefresh: false
  },
  serverError: {
    code: '500',
    title: 'Server Error',
    description: 'Something went wrong on our servers. Our team has been notified and is working on a fix.',
    icon: ServerIcon,
    showRefresh: true
  },
  networkError: {
    code: 'NET',
    title: 'Connection Error',
    description: 'Unable to connect to the server. Please check your internet connection and try again.',
    icon: WifiIcon,
    showRefresh: true
  },
  maintenance: {
    code: '503',
    title: 'Under Maintenance',
    description: 'The system is currently under maintenance. We\'ll be back shortly. Thank you for your patience.',
    icon: ServerIcon,
    showRefresh: true
  }
}

const errorConfig = computed(() =>
  errorConfigs[errorType.value] || errorConfigs.notFound
)

const showRefresh = computed(() => errorConfig.value.showRefresh)
const showDetails = computed(() =>
  ['serverError', 'networkError'].includes(errorType.value)
)

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const refreshPage = () => {
  window.location.reload()
}

onMounted(() => {
  document.title = `${errorConfig.value.code} - ${errorConfig.value.title}`
})
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.error-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
  align-items: center;
}

@media (min-width: 768px) {
  .error-container {
    grid-template-columns: 1fr 1fr;
  }
}

.error-content {
  background: white;
  border-radius: 1rem;
  padding: 3rem 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.dark .error-content {
  background: #1f2937;
}

@media (min-width: 768px) {
  .error-content {
    text-align: left;
  }
}

.error-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .error-icon {
    justify-content: flex-start;
  }
}

.error-icon .icon {
  width: 4rem;
  height: 4rem;
  color: #ef4444;
}

.error-code {
  font-size: 4rem;
  font-weight: bold;
  color: #ef4444;
  margin: 0 0 1rem 0;
  line-height: 1;
}

.error-title {
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.dark .error-title {
  color: white;
}

.error-description {
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.dark .error-description {
  color: #9ca3af;
}

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (min-width: 640px) {
  .error-actions {
    flex-direction: row;
    justify-content: center;
  }
}

@media (min-width: 768px) {
  .error-actions {
    justify-content: flex-start;
  }
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.action-btn .icon {
  width: 1rem;
  height: 1rem;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
}

.action-btn.primary:hover {
  background: #2563eb;
}

.action-btn.secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.action-btn.secondary:hover {
  background: #e5e7eb;
}

.dark .action-btn.secondary {
  background: #374151;
  color: #d1d5db;
  border-color: #4b5563;
}

.dark .action-btn.secondary:hover {
  background: #4b5563;
}

.error-details {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}

.dark .error-details {
  border-color: #374151;
}

.details-section {
  text-align: left;
}

.details-summary {
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  margin-bottom: 1rem;
}

.dark .details-summary {
  color: #d1d5db;
}

.details-content {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.6;
}

.dark .details-content {
  color: #9ca3af;
}

.details-content p {
  margin: 0 0 0.5rem 0;
  word-break: break-all;
}

.error-illustration {
  display: flex;
  justify-content: center;
  align-items: center;
}

.illustration {
  position: relative;
  width: 16rem;
  height: 16rem;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.7;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 8rem;
  height: 8rem;
  top: 2rem;
  left: 2rem;
  background: rgba(239, 68, 68, 0.3);
  animation-delay: 0s;
}

.shape-2 {
  width: 6rem;
  height: 6rem;
  top: 4rem;
  right: 2rem;
  background: rgba(59, 130, 246, 0.3);
  animation-delay: 2s;
}

.shape-3 {
  width: 4rem;
  height: 4rem;
  bottom: 2rem;
  left: 4rem;
  background: rgba(16, 185, 129, 0.3);
  animation-delay: 4s;
}

.illustration.unauthorized .shape-1 {
  background: rgba(245, 158, 11, 0.3);
}

.illustration.serverError .shape-1 {
  background: rgba(239, 68, 68, 0.4);
}

.illustration.networkError .shape-1 {
  background: rgba(59, 130, 246, 0.4);
}

.illustration.maintenance .shape-1 {
  background: rgba(107, 114, 128, 0.4);
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-20px);
  }
}

@media (max-width: 767px) {
  .error-illustration {
    order: -1;
  }

  .illustration {
    width: 12rem;
    height: 12rem;
  }

  .shape-1 {
    width: 6rem;
    height: 6rem;
    top: 1.5rem;
    left: 1.5rem;
  }

  .shape-2 {
    width: 4rem;
    height: 4rem;
    top: 3rem;
    right: 1.5rem;
  }

  .shape-3 {
    width: 3rem;
    height: 3rem;
    bottom: 1.5rem;
    left: 3rem;
  }
}
</style>

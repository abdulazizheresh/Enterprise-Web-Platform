<template>
  <div :class="containerClasses">
    <!-- Spinner -->
    <div v-if="type === 'spinner'" :class="spinnerClasses">
      <svg class="animate-spin h-full w-full" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
    </div>

    <!-- Dots -->
    <div v-else-if="type === 'dots'" class="loading-dots">
      <div class="w-2 h-2 bg-current rounded-full animate-pulse"></div>
      <div class="w-2 h-2 bg-current rounded-full animate-pulse" style="animation-delay: 150ms;"></div>
      <div class="w-2 h-2 bg-current rounded-full animate-pulse" style="animation-delay: 300ms;"></div>
    </div>

    <!-- Pulse -->
    <div v-else-if="type === 'pulse'" :class="pulseClasses">
      <div class="animate-pulse bg-current rounded"></div>
    </div>

    <!-- Skeleton -->
    <div v-else-if="type === 'skeleton'" class="animate-pulse space-y-3">
      <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
      <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
    </div>

    <!-- Bars -->
    <div v-else-if="type === 'bars'" class="flex space-x-1">
      <div class="w-1 bg-current animate-pulse" style="height: 20px; animation-delay: 0ms;"></div>
      <div class="w-1 bg-current animate-pulse" style="height: 25px; animation-delay: 100ms;"></div>
      <div class="w-1 bg-current animate-pulse" style="height: 15px; animation-delay: 200ms;"></div>
      <div class="w-1 bg-current animate-pulse" style="height: 30px; animation-delay: 300ms;"></div>
      <div class="w-1 bg-current animate-pulse" style="height: 20px; animation-delay: 400ms;"></div>
    </div>

    <!-- Text -->
    <div v-if="text" class="mt-3 text-sm text-gray-600 dark:text-gray-400">
      {{ text }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'spinner',
    validator: (value) => ['spinner', 'dots', 'pulse', 'skeleton', 'bars'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'gray', 'white'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  center: {
    type: Boolean,
    default: true
  },
  overlay: {
    type: Boolean,
    default: false
  }
})

const containerClasses = computed(() => {
  const baseClasses = 'flex flex-col items-center'
  const centerClass = props.center ? 'justify-center' : ''
  const overlayClass = props.overlay ? 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 z-50' : ''

  return [baseClasses, centerClass, overlayClass].filter(Boolean).join(' ')
})

const spinnerClasses = computed(() => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-gray-600',
    gray: 'text-gray-400',
    white: 'text-white'
  }

  return [sizeClasses[props.size], colorClasses[props.color]].join(' ')
})

const pulseClasses = computed(() => {
  const sizeClasses = {
    sm: 'h-4 w-16',
    md: 'h-6 w-24',
    lg: 'h-8 w-32',
    xl: 'h-10 w-40'
  }

  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-gray-600',
    gray: 'text-gray-400',
    white: 'text-white'
  }

  return [sizeClasses[props.size], colorClasses[props.color]].join(' ')
})
</script>

<style scoped>
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

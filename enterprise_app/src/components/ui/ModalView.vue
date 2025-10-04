<template>
  <Teleport to="body">
    <Transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
        aria-modal="true">
        <!-- Backdrop -->
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

          <!-- Modal -->
          <Transition enter-active-class="duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <div v-if="show" :class="modalClasses" @click.stop>
              <!-- Header -->
              <div v-if="$slots.header || title" class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <slot name="header">
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                      {{ title }}
                    </h3>
                    <button v-if="closable" @click="closeModal"
                      class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <XMarkIcon class="h-6 w-6" />
                    </button>
                  </div>
                </slot>
              </div>

              <!-- Body -->
              <div class="px-6 py-4">
                <slot></slot>
              </div>

              <!-- Footer -->
              <div v-if="$slots.footer"
                class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700">
                <slot name="footer"></slot>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  closable: {
    type: Boolean,
    default: true
  },
  persistent: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'open'])

const modalClasses = computed(() => {
  const baseClasses = 'inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle'

  const sizeClasses = {
    sm: 'sm:max-w-lg sm:w-full',
    md: 'sm:max-w-2xl sm:w-full',
    lg: 'sm:max-w-4xl sm:w-full',
    xl: 'sm:max-w-6xl sm:w-full',
    full: 'sm:max-w-full sm:w-full sm:h-full sm:rounded-none'
  }

  return [baseClasses, sizeClasses[props.size]].join(' ')
})

const closeModal = () => {
  if (!props.persistent) {
    emit('close')
  }
}

const handleEscape = (event) => {
  if (event.key === 'Escape' && props.show && props.closable && !props.persistent) {
    closeModal()
  }
}

watch(() => props.show, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
    emit('open')
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<template>
  <div :class="cardClasses">
    <!-- Header -->
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <div class="flex items-center justify-between">
          <h3 v-if="title" class="text-lg font-medium text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <div v-if="$slots.actions" class="flex items-center space-x-2">
            <slot name="actions"></slot>
          </div>
        </div>
      </slot>
    </div>

    <!-- Body -->
    <div v-if="$slots.default" class="card-body">
      <slot></slot>
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'bordered', 'shadow', 'elevated'].includes(value)
  },
  padding: {
    type: String,
    default: 'default',
    validator: (value) => ['none', 'sm', 'default', 'lg'].includes(value)
  },
  hover: {
    type: Boolean,
    default: false
  }
})

const cardClasses = computed(() => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg transition-all duration-200'

  const variantClasses = {
    default: 'border border-gray-200 dark:border-gray-700',
    bordered: 'border-2 border-gray-300 dark:border-gray-600',
    shadow: 'shadow-md border border-gray-200 dark:border-gray-700',
    elevated: 'shadow-lg border border-gray-200 dark:border-gray-700'
  }

  const paddingClasses = {
    none: '[&_.card-body]:p-0',
    sm: '[&_.card-body]:p-3 [&_.card-header]:px-3 [&_.card-header]:py-2 [&_.card-footer]:px-3 [&_.card-footer]:py-2',
    default: '[&_.card-body]:p-6 [&_.card-header]:px-6 [&_.card-header]:py-4 [&_.card-footer]:px-6 [&_.card-footer]:py-4',
    lg: '[&_.card-body]:p-8 [&_.card-header]:px-8 [&_.card-header]:py-6 [&_.card-footer]:px-8 [&_.card-footer]:py-6'
  }

  const hoverClass = props.hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : ''

  return [
    baseClasses,
    variantClasses[props.variant],
    paddingClasses[props.padding],
    hoverClass
  ].filter(Boolean).join(' ')
})
</script>

<style scoped>
.card-header {
  @apply border-b border-gray-200 dark:border-gray-700;
}

.card-footer {
  @apply border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50;
}
</style>

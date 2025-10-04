<template>
  <div class="w-full h-full">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    default: () => ({})
  },
  type: {
    type: String,
    default: 'pie',
    validator: (value) => ['pie', 'doughnut'].includes(value)
  }
})

const chartCanvas = ref(null)
let chartInstance = null

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        usePointStyle: true,
        color: '#6B7280',
        padding: 20,
        generateLabels: (chart) => {
          const data = chart.data
          if (data.labels.length && data.datasets.length) {
            return data.labels.map((label, i) => {
              const dataset = data.datasets[0]
              const backgroundColor = dataset.backgroundColor[i]
              const value = dataset.data[i]
              const total = dataset.data.reduce((sum, val) => sum + val, 0)
              const percentage = ((value / total) * 100).toFixed(1)

              return {
                text: `${label} (${percentage}%)`,
                fillStyle: backgroundColor,
                strokeStyle: backgroundColor,
                pointStyle: 'circle',
                hidden: false,
                index: i
              }
            })
          }
          return []
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
      titleColor: '#F9FAFB',
      bodyColor: '#F9FAFB',
      borderColor: '#374151',
      borderWidth: 1,
      callbacks: {
        label: function (context) {
          const label = context.label || ''
          const value = context.parsed
          const total = context.dataset.data.reduce((sum, val) => sum + val, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${label}: ${value} (${percentage}%)`
        }
      }
    }
  },
  cutout: props.type === 'doughnut' ? '50%' : 0
}

const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  if (!chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')

  chartInstance = new Chart(ctx, {
    type: props.type,
    data: props.data,
    options: {
      ...defaultOptions,
      ...props.options
    }
  })
}

const updateChart = () => {
  if (chartInstance) {
    chartInstance.data = props.data
    chartInstance.update('none')
  }
}

watch(() => props.data, updateChart, { deep: true })
watch(() => props.options, () => {
  if (chartInstance) {
    chartInstance.options = {
      ...defaultOptions,
      ...props.options
    }
    chartInstance.update()
  }
}, { deep: true })

onMounted(async () => {
  await nextTick()
  createChart()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

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
  height: {
    type: Number,
    default: 400
  }
})

const chartCanvas = ref(null)
let chartInstance = null

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        color: '#6B7280'
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
      titleColor: '#F9FAFB',
      bodyColor: '#F9FAFB',
      borderColor: '#374151',
      borderWidth: 1
    }
  },
  scales: {
    x: {
      grid: {
        color: '#E5E7EB'
      },
      ticks: {
        color: '#6B7280'
      }
    },
    y: {
      grid: {
        color: '#E5E7EB'
      },
      ticks: {
        color: '#6B7280'
      }
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  },
  elements: {
    point: {
      radius: 4,
      hoverRadius: 6
    },
    line: {
      tension: 0.3
    }
  }
}

const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  if (!chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')

  chartInstance = new Chart(ctx, {
    type: 'line',
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

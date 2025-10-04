import { ref, computed, watch, onMounted } from 'vue'

const theme = ref('system')
const isDarkMode = ref(false)

export function useTheme() {
  const setTheme = (newTheme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    updateDOM()
  }

  const toggleTheme = () => {
    const newTheme = isDarkMode.value ? 'light' : 'dark'
    setTheme(newTheme)
  }

  const updateDOM = () => {
    const root = document.documentElement

    if (theme.value === 'dark') {
      root.classList.add('dark')
      isDarkMode.value = true
    } else if (theme.value === 'light') {
      root.classList.remove('dark')
      isDarkMode.value = false
    } else {
      // System preference
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (systemDark) {
        root.classList.add('dark')
        isDarkMode.value = true
      } else {
        root.classList.remove('dark')
        isDarkMode.value = false
      }
    }
  }

  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      theme.value = savedTheme
    }
    updateDOM()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (theme.value === 'system') {
        updateDOM()
      }
    })
  }

  const currentTheme = computed(() => theme.value)

  const themeIcon = computed(() => {
    if (theme.value === 'dark') return 'sun'
    if (theme.value === 'light') return 'moon'
    return isDarkMode.value ? 'sun' : 'moon'
  })

  watch(theme, updateDOM)

  onMounted(() => {
    initializeTheme()
  })

  return {
    theme: currentTheme,
    isDarkMode: computed(() => isDarkMode.value),
    themeIcon,
    setTheme,
    toggleTheme,
    initializeTheme
  }
}

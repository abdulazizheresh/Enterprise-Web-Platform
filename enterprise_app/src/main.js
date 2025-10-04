import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Import global styles
import './assets/css/main.css'

// Import plugins
import './plugins/pinia'
import './plugins/socket'

// Create Vue app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err)
  console.error('Component info:', info)
}

// Mount app
app.mount('#app')

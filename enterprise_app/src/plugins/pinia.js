import { createPinia } from 'pinia'

const pinia = createPinia()

// Development plugins
if (import.meta.env.DEV) {
  // Add state persistence plugin in development
  pinia.use(({ store }) => {
    store.$subscribe((mutation) => {
      console.log(`[${mutation.storeId}] ${mutation.type}:`, mutation.payload)
    })
  })
}

// Persistence plugin for auth store
pinia.use(({ store }) => {
  if (store.$id === 'auth') {
    store.$subscribe(
      (mutation, state) => {
        if (state.token) {
          localStorage.setItem('auth-token', state.token)
        } else {
          localStorage.removeItem('auth-token')
        }
      },
      { detached: true }
    )
  }
})

export default pinia

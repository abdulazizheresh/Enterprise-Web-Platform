import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Route guards
const requireAuth = (to, from, next) => {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) {
    next('/auth/login')
  } else {
    next()
  }
}

const requireGuest = (to, from, next) => {
  const authStore = useAuthStore()
  if (authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
}

const requireAdmin = (to, from, next) => {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) {
    next('/auth/login')
  } else if (!authStore.isAdmin) {
    next('/unauthorized')
  } else {
    next()
  }
}

const routes = [
  // Public routes
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },

  // Auth routes
  {
    path: '/auth',
    beforeEnter: requireGuest,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/auth/LoginView.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/auth/RegisterView.vue')
      },
      {
        path: 'mfa',
        name: 'MFA',
        component: () => import('@/views/auth/MFAView.vue')
      }
    ]
  },

  // Protected routes
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('@/views/NotificationsView.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/health',
    name: 'HealthMonitor',
    component: () => import('@/views/HealthMonitor.vue'),
    beforeEnter: requireAuth
  },

  // Admin routes
  // {
  //   path: '/admin',
  //   beforeEnter: requireAdmin,
  //   children: [
  //     {
  //       path: 'users',
  //       name: 'AdminUsers',
  //       component: () => import('@/views/admin/UsersView.vue')
  //     },
  //     {
  //       path: 'settings',
  //       name: 'AdminSettings',
  //       component: () => import('@/views/admin/SettingsView.vue')
  //     }
  //   ]
  // },


  // Management routes (accessible to all authenticated users)
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/admin/UsersView.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/admin/SettingsView.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/analysis/ReportsView.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('@/views/analysis/AnalyticsView.vue'),
    beforeEnter: requireAuth
  },

  // Error routes
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('@/views/ErrorView.vue'),
    props: { error: 'unauthorized' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/ErrorView.vue'),
    props: { error: 'notFound' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// Global navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth if not done yet
  if (!authStore.isInitialized) {
    await authStore.initializeAuth()
  }

  next()
})

export default router

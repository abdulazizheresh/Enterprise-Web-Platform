// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://4.248.248.213/api'
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://4.248.248.213'

// App Info
export const APP_NAME = 'Enterprise Platform'
export const APP_VERSION = '1.0.0'

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth-token',
  THEME: 'theme',
  USER_PREFERENCES: 'user-preferences',
  RECENT_SEARCHES: 'recent-searches'
}

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile'
}

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
}

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
}

// Themes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
}

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  AVATAR_SIZE: 150
}

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3B82F6',
  SUCCESS: '#22C55E',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  INFO: '#06B6D4',
  GRAY: '#6B7280'
}

// Time Formats
export const TIME_FORMATS = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
  DISPLAY: 'MMM DD, YYYY'
}

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  NAME_MAX_LENGTH: 100,
  BIO_MAX_LENGTH: 500
}

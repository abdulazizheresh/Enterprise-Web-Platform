import { VALIDATION_RULES } from './constants'

// Basic validators
export const required = (value) => {
  if (!value || value.toString().trim() === '') {
    return 'This field is required'
  }
  return null
}

export const email = (value) => {
  if (!value) return null
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value) ? null : 'Invalid email address'
}

export const minLength = (min) => (value) => {
  if (!value) return null
  return value.length >= min ? null : `Must be at least ${min} characters`
}

export const maxLength = (max) => (value) => {
  if (!value) return null
  return value.length <= max ? null : `Must be no more than ${max} characters`
}

// Password validation
export const password = (value) => {
  if (!value) return 'Password is required'

  if (value.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`
  }

  if (!/(?=.*[a-z])/.test(value)) {
    return 'Password must contain at least one lowercase letter'
  }

  if (!/(?=.*[A-Z])/.test(value)) {
    return 'Password must contain at least one uppercase letter'
  }

  if (!/(?=.*\d)/.test(value)) {
    return 'Password must contain at least one number'
  }

  return null
}

export const confirmPassword = (originalPassword) => (value) => {
  if (!value) return 'Please confirm your password'
  return value === originalPassword ? null : 'Passwords do not match'
}

// Username validation
export const username = (value) => {
  if (!value) return 'Username is required'

  if (value.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
    return `Username must be at least ${VALIDATION_RULES.USERNAME_MIN_LENGTH} characters`
  }

  if (value.length > VALIDATION_RULES.USERNAME_MAX_LENGTH) {
    return `Username must be no more than ${VALIDATION_RULES.USERNAME_MAX_LENGTH} characters`
  }

  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    return 'Username can only contain letters, numbers, and underscore'
  }

  return null
}

// Name validation
export const name = (value) => {
  if (!value) return 'Name is required'

  if (value.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    return `Name must be no more than ${VALIDATION_RULES.NAME_MAX_LENGTH} characters`
  }

  return null
}

// Phone validation
export const phone = (value) => {
  if (!value) return null
  const phoneRegex = /^\+?[1-9][\d]{0,15}$/
  return phoneRegex.test(value.replace(/\s/g, '')) ? null : 'Invalid phone number'
}

// URL validation
export const url = (value) => {
  if (!value) return null
  try {
    new URL(value)
    return null
  } catch {
    return 'Invalid URL'
  }
}

// File validation
export const fileSize = (maxSizeInMB) => (file) => {
  if (!file) return null
  const maxSize = maxSizeInMB * 1024 * 1024
  return file.size <= maxSize ? null : `File size must be less than ${maxSizeInMB}MB`
}

export const fileType = (allowedTypes) => (file) => {
  if (!file) return null
  return allowedTypes.includes(file.type) ? null : `File type must be one of: ${allowedTypes.join(', ')}`
}

// Composite validators
export const validateForm = (fields, values) => {
  const errors = {}

  Object.keys(fields).forEach(field => {
    const validators = Array.isArray(fields[field]) ? fields[field] : [fields[field]]
    const value = values[field]

    for (const validator of validators) {
      const error = validator(value)
      if (error) {
        errors[field] = error
        break
      }
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

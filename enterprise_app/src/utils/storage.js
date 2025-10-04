import { STORAGE_KEYS } from './constants'

class Storage {
  constructor() {
    this.isAvailable = this.checkStorageAvailability()
  }

  checkStorageAvailability() {
    try {
      const test = '__localStorage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  set(key, value) {
    if (!this.isAvailable) return false

    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      return false
    }
  }

  get(key, defaultValue = null) {
    if (!this.isAvailable) return defaultValue

    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  }

  remove(key) {
    if (!this.isAvailable) return false

    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing from localStorage:', error)
      return false
    }
  }

  clear() {
    if (!this.isAvailable) return false

    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }

  // Specific storage methods
  setToken(token) {
    return this.set(STORAGE_KEYS.TOKEN, token)
  }

  getToken() {
    return this.get(STORAGE_KEYS.TOKEN)
  }

  removeToken() {
    return this.remove(STORAGE_KEYS.TOKEN)
  }

  setTheme(theme) {
    return this.set(STORAGE_KEYS.THEME, theme)
  }

  getTheme() {
    return this.get(STORAGE_KEYS.THEME, 'system')
  }

  setUserPreferences(preferences) {
    return this.set(STORAGE_KEYS.USER_PREFERENCES, preferences)
  }

  getUserPreferences() {
    return this.get(STORAGE_KEYS.USER_PREFERENCES, {})
  }

  setRecentSearches(searches) {
    return this.set(STORAGE_KEYS.RECENT_SEARCHES, searches)
  }

  getRecentSearches() {
    return this.get(STORAGE_KEYS.RECENT_SEARCHES, [])
  }

  addRecentSearch(search) {
    const searches = this.getRecentSearches()
    const filtered = searches.filter(s => s !== search)
    const updated = [search, ...filtered].slice(0, 10)
    return this.setRecentSearches(updated)
  }
}

export default new Storage()

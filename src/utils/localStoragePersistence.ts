const STORAGE_PREFIX = 'react-gateway:'

export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    const storageKey = `${STORAGE_PREFIX}${key}`
    const serialized = JSON.stringify(data)
    localStorage.setItem(storageKey, serialized)
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Could not save data.')
    } else {
      console.error('Error saving to localStorage:', error)
    }
  }
}

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const storageKey = `${STORAGE_PREFIX}${key}`
    const item = localStorage.getItem(storageKey)
    if (item === null) {
      return defaultValue
    }
    return JSON.parse(item) as T
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return defaultValue
  }
}

export const removeFromLocalStorage = (key: string): void => {
  try {
    const storageKey = `${STORAGE_PREFIX}${key}`
    localStorage.removeItem(storageKey)
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

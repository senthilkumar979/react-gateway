import type { Snapshot } from '@/types/snapshots.types'

export const captureLocalStorage = (): Record<string, string> => {
  const storage: Record<string, string> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      storage[key] = localStorage.getItem(key) || ''
    }
  }
  return storage
}

export const captureSessionStorage = (): Record<string, string> => {
  const storage: Record<string, string> = {}
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i)
    if (key) {
      storage[key] = sessionStorage.getItem(key) || ''
    }
  }
  return storage
}

export const captureCookies = (): string => {
  return document.cookie
}

export const restoreLocalStorage = (storage: Record<string, string>): void => {
  localStorage.clear()
  Object.entries(storage).forEach(([key, value]) => {
    localStorage.setItem(key, value)
  })
}

export const restoreSessionStorage = (storage: Record<string, string>): void => {
  sessionStorage.clear()
  Object.entries(storage).forEach(([key, value]) => {
    sessionStorage.setItem(key, value)
  })
}

export const restoreCookies = (cookies: string): void => {
  document.cookie = cookies
}

export const createSnapshot = (name: string): Snapshot => {
  return {
    id: `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    localStorage: captureLocalStorage(),
    sessionStorage: captureSessionStorage(),
    cookies: captureCookies(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

export const restoreSnapshot = (snapshot: Snapshot): void => {
  restoreLocalStorage(snapshot.localStorage)
  restoreSessionStorage(snapshot.sessionStorage)
  restoreCookies(snapshot.cookies)
}

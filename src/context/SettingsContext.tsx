import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { loadFromLocalStorage, saveToLocalStorage } from '@/utils/localStoragePersistence'
import type { Settings } from '@/types/Settings.types'

interface SettingsContextValue {
  settings: Settings
  updateSettings: (updates: Partial<Settings>) => void
}

const defaultSettings: Settings = {
  position: 'right',
  timeFreeze: {
    enabled: false,
    frozenDate: null,
  },
  timeOffset: {
    enabled: false,
    offsetDays: 0,
  },
  chaos: false
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined)

interface SettingsProviderProps {
  children: ReactNode
  initialPosition?: 'left' | 'right'
}

export const SettingsProvider = ({ children, initialPosition }: SettingsProviderProps) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = loadFromLocalStorage<Settings>('settings', defaultSettings)
    if (initialPosition) {
      return { ...saved, position: initialPosition }
    }
    return saved
  })

  useEffect(() => {
    saveToLocalStorage('settings', settings)
  }, [settings])

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = (): SettingsContextValue => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}

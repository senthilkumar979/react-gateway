import type { Settings } from '@/types/Settings.types'
import { loadFromLocalStorage, saveToLocalStorage } from '@/utils/localStoragePersistence'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

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

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = loadFromLocalStorage<Settings>('settings', defaultSettings)
    return { ...saved }
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

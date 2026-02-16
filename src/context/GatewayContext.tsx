import { loadFromLocalStorage, saveToLocalStorage } from '@/utils/localStoragePersistence'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

interface GatewayState {
  isOpen: boolean
  activeScenarioId: string | null
}

interface GatewayContextValue {
  state: GatewayState
  setIsOpen: (isOpen: boolean) => void
  setActiveScenarioId: (id: string | null) => void
}

const defaultState: GatewayState = {
  isOpen: false,
  activeScenarioId: null,
}

const GatewayContext = createContext<GatewayContextValue | undefined>(undefined)

export const GatewayProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GatewayState>(() => {
    const saved = loadFromLocalStorage<Partial<GatewayState>>('gateway', {})
    return {
      ...defaultState,
      ...saved,
    }
  })

  useEffect(() => {
    saveToLocalStorage('gateway', {
      activeScenarioId: state.activeScenarioId,
    })
  }, [state.activeScenarioId])

  const setIsOpen = useCallback((isOpen: boolean) => {
    setState((prev) => ({ ...prev, isOpen }))
  }, [])

  const setActiveScenarioId = useCallback((activeScenarioId: string | null) => {
    setState((prev) => ({ ...prev, activeScenarioId }))
  }, [])

  return (
    <GatewayContext.Provider
      value={{
        state,
        setIsOpen,
        setActiveScenarioId,
      }}
    >
      {children}
    </GatewayContext.Provider>
  )
}

export const useGateway = (): GatewayContextValue => {
  const context = useContext(GatewayContext)
  if (!context) {
    throw new Error('useGateway must be used within GatewayProvider')
  }
  return context
}

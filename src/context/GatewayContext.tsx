import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { loadFromLocalStorage, saveToLocalStorage } from '@/utils/localStoragePersistence'

interface GatewayState {
  isOpen: boolean
  drawerPosition: 'left' | 'right'
  triggerPosition: 'left' | 'right'
  activeScenarioId: string | null
}

interface GatewayContextValue {
  state: GatewayState
  setIsOpen: (isOpen: boolean) => void
  setDrawerPosition: (position: 'left' | 'right') => void
  setTriggerPosition: (position: 'left' | 'right') => void
  setActiveScenarioId: (id: string | null) => void
}

const defaultState: GatewayState = {
  isOpen: false,
  drawerPosition: 'right',
  triggerPosition: 'right',
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
      drawerPosition: state.drawerPosition,
      triggerPosition: state.triggerPosition,
      activeScenarioId: state.activeScenarioId,
    })
  }, [state.drawerPosition, state.triggerPosition, state.activeScenarioId])

  const setIsOpen = useCallback((isOpen: boolean) => {
    setState((prev) => ({ ...prev, isOpen }))
  }, [])

  const setDrawerPosition = useCallback((drawerPosition: 'left' | 'right') => {
    setState((prev) => ({ ...prev, drawerPosition }))
  }, [])

  const setTriggerPosition = useCallback((triggerPosition: 'left' | 'right') => {
    setState((prev) => ({ ...prev, triggerPosition }))
  }, [])

  const setActiveScenarioId = useCallback((activeScenarioId: string | null) => {
    setState((prev) => ({ ...prev, activeScenarioId }))
  }, [])

  return (
    <GatewayContext.Provider
      value={{
        state,
        setIsOpen,
        setDrawerPosition,
        setTriggerPosition,
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

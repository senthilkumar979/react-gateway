import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { loadFromLocalStorage, saveToLocalStorage } from '@/utils/localStoragePersistence'
import type { UIFlow } from '@/types/uiFlows.types'

interface UIFlowsContextValue {
  flows: UIFlow[]
  addFlow: (flow: Omit<UIFlow, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateFlow: (id: string, flow: Partial<UIFlow>) => void
  deleteFlow: (id: string) => void
  getFlow: (id: string) => UIFlow | undefined
}

const UIFlowsContext = createContext<UIFlowsContextValue | undefined>(undefined)

export const UIFlowsProvider = ({ children }: { children: ReactNode }) => {
  const [flows, setFlows] = useState<UIFlow[]>(() => {
    return loadFromLocalStorage<UIFlow[]>('uiFlows', [])
  })

  useEffect(() => {
    saveToLocalStorage('uiFlows', flows)
  }, [flows])

  const addFlow = (flowData: Omit<UIFlow, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newFlow: UIFlow = {
      ...flowData,
      id: `flow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setFlows((prev) => [...prev, newFlow])
  }

  const updateFlow = (id: string, updates: Partial<UIFlow>) => {
    setFlows((prev) =>
      prev.map((flow) =>
        flow.id === id ? { ...flow, ...updates, updatedAt: Date.now() } : flow
      )
    )
  }

  const deleteFlow = (id: string) => {
    setFlows((prev) => prev.filter((flow) => flow.id !== id))
  }

  const getFlow = (id: string) => {
    return flows.find((flow) => flow.id === id)
  }

  return (
    <UIFlowsContext.Provider
      value={{
        flows,
        addFlow,
        updateFlow,
        deleteFlow,
        getFlow,
      }}
    >
      {children}
    </UIFlowsContext.Provider>
  )
}

export const useUIFlows = (): UIFlowsContextValue => {
  const context = useContext(UIFlowsContext)
  if (!context) {
    throw new Error('useUIFlows must be used within UIFlowsProvider')
  }
  return context
}

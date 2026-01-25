import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { loadFromLocalStorage, saveToLocalStorage } from '@/utils/localStoragePersistence'
import type { Scenario } from '@/types/Scenarios.types'

interface ScenariosContextValue {
  scenarios: Scenario[]
  addScenario: (scenario: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateScenario: (id: string, scenario: Partial<Scenario>) => void
  deleteScenario: (id: string) => void
  getScenario: (id: string) => Scenario | undefined
}

const ScenariosContext = createContext<ScenariosContextValue | undefined>(undefined)

export const ScenariosProvider = ({ children }: { children: ReactNode }) => {
  const [scenarios, setScenarios] = useState<Scenario[]>(() => {
    return loadFromLocalStorage<Scenario[]>('scenarios', [])
  })

  useEffect(() => {
    saveToLocalStorage('scenarios', scenarios)
  }, [scenarios])

  const addScenario = (scenarioData: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newScenario: Scenario = {
      ...scenarioData,
      id: `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setScenarios((prev) => [...prev, newScenario])
  }

  const updateScenario = (id: string, updates: Partial<Scenario>) => {
    setScenarios((prev) =>
      prev.map((scenario) =>
        scenario.id === id
          ? { ...scenario, ...updates, updatedAt: Date.now() }
          : scenario
      )
    )
  }

  const deleteScenario = (id: string) => {
    setScenarios((prev) => prev.filter((scenario) => scenario.id !== id))
  }

  const getScenario = (id: string) => {
    return scenarios.find((scenario) => scenario.id === id)
  }

  return (
    <ScenariosContext.Provider
      value={{
        scenarios,
        addScenario,
        updateScenario,
        deleteScenario,
        getScenario,
      }}
    >
      {children}
    </ScenariosContext.Provider>
  )
}

export const useScenarios = (): ScenariosContextValue => {
  const context = useContext(ScenariosContext)
  if (!context) {
    throw new Error('useScenarios must be used within ScenariosProvider')
  }
  return context
}

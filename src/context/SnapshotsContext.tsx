import { loadFromLocalStorage, saveToLocalStorage } from '@/utils/localStoragePersistence'
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

interface SnapshotsContextValue {
  activeSnapshotId: string | null,
  changeActiveSnapshotId: (id: string | null) => void
}

const SnapshotsContext = createContext<SnapshotsContextValue | undefined>(undefined)

export const SnapshotsProvider = ({ children }: { children: ReactNode }) => {

  const [activeSnapshotId, setActiveSnapshotId] = useState<string | null>(() => {
    return loadFromLocalStorage<string | null>('activeSnapshot', null)
  })

  useEffect(() => {
    saveToLocalStorage('activeSnapshot', activeSnapshotId)
  }, [activeSnapshotId])

  const changeActiveSnapshotId = useCallback((id: string | null) => {
    setActiveSnapshotId(id)
  }, [])


  return (
    <SnapshotsContext.Provider
      value={{
        activeSnapshotId,
        changeActiveSnapshotId,
      }}
    >
      {children}
    </SnapshotsContext.Provider>
  )
}

export const useSnapshots = (): SnapshotsContextValue => {
  const context = useContext(SnapshotsContext)
  if (!context) {
    throw new Error('useSnapshots must be used within SnapshotsProvider')
  }
  return context
}

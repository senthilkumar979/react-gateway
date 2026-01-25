import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { loadFromLocalStorage, saveToLocalStorage } from '@/utils/localStoragePersistence'
import type { Snapshot } from '@/types/Snapshots.types'

interface SnapshotsContextValue {
  snapshots: Snapshot[]
  activeSnapshotId: string | null
  addSnapshot: (snapshot: Omit<Snapshot, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateSnapshot: (id: string, snapshot: Partial<Snapshot>) => void
  deleteSnapshot: (id: string) => void
  getSnapshot: (id: string) => Snapshot | undefined
  setActiveSnapshotId: (id: string | null) => void
}

const SnapshotsContext = createContext<SnapshotsContextValue | undefined>(undefined)

export const SnapshotsProvider = ({ children }: { children: ReactNode }) => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>(() => {
    return loadFromLocalStorage<Snapshot[]>('snapshots', [])
  })

  const [activeSnapshotId, setActiveSnapshotId] = useState<string | null>(() => {
    return loadFromLocalStorage<string | null>('activeSnapshot', null)
  })

  useEffect(() => {
    saveToLocalStorage('snapshots', snapshots)
  }, [snapshots])

  useEffect(() => {
    saveToLocalStorage('activeSnapshot', activeSnapshotId)
  }, [activeSnapshotId])

  const addSnapshot = (snapshotData: Omit<Snapshot, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSnapshot: Snapshot = {
      ...snapshotData,
      id: `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setSnapshots((prev) => [...prev, newSnapshot])
  }

  const updateSnapshot = (id: string, updates: Partial<Snapshot>) => {
    setSnapshots((prev) =>
      prev.map((snapshot) =>
        snapshot.id === id
          ? { ...snapshot, ...updates, updatedAt: Date.now() }
          : snapshot
      )
    )
  }

  const deleteSnapshot = (id: string) => {
    setSnapshots((prev) => prev.filter((snapshot) => snapshot.id !== id))
    if (activeSnapshotId === id) {
      setActiveSnapshotId(null)
    }
  }

  const getSnapshot = (id: string) => {
    return snapshots.find((snapshot) => snapshot.id === id)
  }

  return (
    <SnapshotsContext.Provider
      value={{
        snapshots,
        activeSnapshotId,
        addSnapshot,
        updateSnapshot,
        deleteSnapshot,
        getSnapshot,
        setActiveSnapshotId,
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

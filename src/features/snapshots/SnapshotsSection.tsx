import { useState } from 'react'
import { AccordionSection } from '@/components/AccordionSection'
import { useSnapshots } from '@/context/SnapshotsContext'
import { SnapshotDropdown } from './SnapshotDropdown'
import { createSnapshot } from '@/utils/storageManager'
import { FormLabel } from '@/ui/FormLabel'

export const SnapshotsSection = () => {
  const { snapshots, addSnapshot, setActiveSnapshotId, activeSnapshotId } = useSnapshots()
  const [snapshotName, setSnapshotName] = useState('')

  const handleCreate = () => {
    if (!snapshotName.trim()) return

    const snapshot = createSnapshot(snapshotName.trim())
    addSnapshot({
      name: snapshot.name,
      localStorage: snapshot.localStorage,
      sessionStorage: snapshot.sessionStorage,
      cookies: snapshot.cookies,
    })
    setSnapshotName('')
  }

  const handleSelect = (id: string | null) => {
    setActiveSnapshotId(id)
  }

  return (
    <AccordionSection title="Snapshots">
      <div className="mb-3">
        <FormLabel
          htmlFor="snapshot-name"
          description="Capture current localStorage, sessionStorage, and cookies state"
        >
          Create Snapshot
        </FormLabel>
        <div className="input-group">
          <input
            id="snapshot-name"
            type="text"
            className="form-control"
            value={snapshotName}
            onChange={(e) => setSnapshotName(e.target.value)}
            placeholder="Snapshot name"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreate()
              }
            }}
          />
          <button className="btn btn-primary" onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>
      <div className="mb-3">
        <SnapshotDropdown
          snapshots={snapshots}
          selectedId={activeSnapshotId}
          onSelect={handleSelect}
        />
      </div>
    </AccordionSection>
  )
}

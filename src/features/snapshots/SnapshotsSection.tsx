import { AccordionSection } from '@/components/AccordionSection'
import { useSnapshots } from '@/context/SnapshotsContext'
import { FormLabel } from '@/ui/FormLabel'
import { createSnapshot } from '@/utils/storageManager'
import { useState } from 'react'
import { SnapshotDropdown } from './SnapshotDropdown'
import { IconPlus } from '../../assets/IconPlus'
import { IconCross } from '../../assets/IconCross'
import { IconCheck } from '../../assets/IconCheck'
import { Button } from 'react-bootstrap'

export const SnapshotsSection = () => {
  const {
    snapshots,
    addSnapshot,
    setActiveSnapshotId,
    activeSnapshotId,
    deleteSnapshot,
  } = useSnapshots()
  const [snapshotName, setSnapshotName] = useState('')
  const [showForm, setShowForm] = useState(false)

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
    setShowForm(false)
  }

  const handleSelect = (id: string | null) => {
    setActiveSnapshotId(id)
  }

  const handleDelete = (id: string) => {
    deleteSnapshot(id)
    setShowForm(false)
    setSnapshotName('')
  }

  const handleSnapshotNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow values that start with a letter and are followed by alphanumeric characters
    const regex = /^[a-zA-Z][a-zA-Z0-9]{0,24}$/
    if (value === '' || regex.test(value)) {
      setSnapshotName(value)
    }
  }

  const handleSnapshotNameKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      // Only allow create if name matches rules (redundant but safe for keyboard submits)
      const regex = /^[a-zA-Z][a-zA-Z0-9]{2,24}$/
      if (regex.test(snapshotName)) {
        handleCreate()
      }
    }
  }

  return (
    <AccordionSection
      title="Snapshots"
      description="Create a snapshot to set your context, storage, and cookies state"
    >
      <div className="">
        {!showForm ? (
          <div className="d-flex justify-content-end align-items-center">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setShowForm(true)}
            >
              <IconPlus width={16} height={16} />
              Add Snapshot
            </button>
          </div>
        ) : (
          <div className="mb-3">
            <FormLabel
              htmlFor="snapshot-name"
              description="Create a snapshot to set your context, storage, and cookies state"
            >
              Create Snapshot
            </FormLabel>
            <div className="input-group">
              <input
                id="snapshot-name"
                type="text"
                className="form-control"
                value={snapshotName}
                onChange={handleSnapshotNameChange}
                placeholder="Snapshot name"
                minLength={3}
                maxLength={25}
                pattern="[a-zA-Z][a-zA-Z0-9]{2,24}"
                onKeyPress={handleSnapshotNameKeyPress}
                autoFocus
              />
              <Button size="sm" variant="primary" onClick={handleCreate}>
                <IconCheck width={16} height={16} />
              </Button>
              <Button
                size="sm"
                variant="outline-secondary"
                onClick={() => {
                  setShowForm(false)
                  setSnapshotName('')
                }}
              >
                <IconCross width={16} height={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
      {snapshots.length > 0 && (
        <div className="mb-3">
          <SnapshotDropdown
            snapshots={snapshots}
            selectedId={activeSnapshotId}
            onSelect={handleSelect}
            onDelete={handleDelete}
          />
        </div>
      )}
    </AccordionSection>
  )
}

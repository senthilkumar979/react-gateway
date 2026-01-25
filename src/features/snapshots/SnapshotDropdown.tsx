import type { Snapshot } from '@/types/Snapshots.types'
import { useState } from 'react'
import { FormLabel } from '@/ui/FormLabel'
import { IconTrash } from '../../assets/IconTrash'

interface SnapshotDropdownProps {
  snapshots: Snapshot[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onDelete?: (id: string) => void // Optional prop for deletion
}

export const SnapshotDropdown = ({
  snapshots,
  selectedId,
  onSelect,
  onDelete,
}: SnapshotDropdownProps) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleRequestDelete = (id: string) => {
    setDeleteId(id)
    setModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (onDelete && deleteId) {
      onDelete(deleteId)
    }
    setModalOpen(false)
    setDeleteId(null)
  }

  const handleCancelDelete = () => {
    setModalOpen(false)
    setDeleteId(null)
  }

  return (
    <div>
      <FormLabel htmlFor="snapshot-select" description="Select a snapshot.">
        Select Snapshot
      </FormLabel>
      <div>
        <select
          id="snapshot-select"
          className="form-select"
          value={selectedId ?? ''}
          onChange={(e) =>
            onSelect(e.target.value === '' ? null : e.target.value)
          }
        >
          <option value="">-- None --</option>
          {snapshots.map((snapshot) => (
            <option key={snapshot.id} value={snapshot.id}>
              {snapshot.name}
            </option>
          ))}
        </select>
        {selectedId == null && (
          <div className="mt-2">
            <small className="text-muted">No snapshot selected.</small>
          </div>
        )}
      </div>
      <div className="mt-4">
        <FormLabel
          htmlFor="snapshot-list"
          description="All available snapshots. Delete if needed."
        >
          All Snapshots
        </FormLabel>
        <ul id="snapshot-list" className="list-group">
          {snapshots.length === 0 && (
            <li className="list-group-item text-muted">No snapshots saved.</li>
          )}
          {snapshots.map((snapshot) => (
            <li
              key={snapshot.id}
              className={`list-group-item d-flex justify-content-between align-items-center${
                snapshot.id === selectedId
                  ? ' active bg-success bg-opacity-10'
                  : ''
              }`}
            >
              <span>{snapshot.name}</span>
              {onDelete && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  title="Delete snapshot"
                  onClick={() => handleRequestDelete(snapshot.id)}
                >
                  <IconTrash width={16} height={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      {modalOpen && (
        <div
          className="modal fade show"
          tabIndex={-1}
          style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }}
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Snapshot</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCancelDelete}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete this snapshot?
                  <br />
                  <strong>
                    {snapshots.find((s) => s.id === deleteId)?.name ?? ''}
                  </strong>
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelDelete}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

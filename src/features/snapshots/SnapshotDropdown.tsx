import type { Snapshot } from '@/types/snapshots.types'
import { FormLabel } from '@/ui/FormLabel'

interface SnapshotDropdownProps {
  snapshots: Snapshot[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export const SnapshotDropdown = ({ snapshots, selectedId, onSelect }: SnapshotDropdownProps) => {
  const selectedSnapshot = snapshots.find((s) => s.id === selectedId)

  return (
    <div>
      <FormLabel
        htmlFor="snapshot-select"
        description="Restore a previously saved snapshot of storage state"
      >
        Select Snapshot
      </FormLabel>
      <select
        id="snapshot-select"
        className="form-select"
        value={selectedId || ''}
        onChange={(e) => onSelect(e.target.value || null)}
      >
        <option value="">None</option>
        {snapshots.map((snapshot) => (
          <option key={snapshot.id} value={snapshot.id}>
            {snapshot.name}
          </option>
        ))}
      </select>
      {selectedSnapshot && (
        <div className="mt-2">
          <small className="text-muted">
            Created: {new Date(selectedSnapshot.createdAt).toLocaleString()}
          </small>
        </div>
      )}
    </div>
  )
}

import { useSnapshots } from '@/context/SnapshotsContext'
import { FormLabel } from '@/ui/FormLabel'
import { Badge, Form } from 'react-bootstrap'
import { sileo } from 'sileo'

interface SnapshotDropdownProps {
  snapshots: Record<string, string>[]
  onSelect: (id: string | null) => void
}

export const SnapshotDropdown = ({
  snapshots,
  onSelect,
}: SnapshotDropdownProps) => {
  const { activeSnapshotId, changeActiveSnapshotId } = useSnapshots()

  const handleSelect = (id: string | null) => {
    changeActiveSnapshotId(id)
    onSelect(id)
    const name = snapshots.find((snapshot) => snapshot.id === id)?.name
    sileo.success({
      title: `Snapshot selected`,
      description: `The snapshot ${name} has been selected.`,
      duration: 3000,
      fill: 'black',
      styles: {
        title: 'text-white!',
        description: 'text-white/75!',
      },
      autopilot: {
        expand: 500,
        collapse: 2500,
      },
    })
  }

  return (
    <div>
      <FormLabel htmlFor="snapshot-select" description="Select a snapshot.">
        Select Snapshot
      </FormLabel>
      <div>
        <div>
          <Form.Select
            id="snapshot-select"
            className="form-select"
            value={activeSnapshotId ?? ''}
            onChange={(e) =>
              handleSelect(e.target.value === '' ? null : e.target.value)
            }
          >
            <option value="">-- None --</option>
            {snapshots.map((snapshot) => (
              <option key={snapshot.id} value={snapshot.id}>
                {snapshot.name}
              </option>
            ))}
          </Form.Select>
        </div>
        {activeSnapshotId == null && (
          <div className="mt-3">
            <small className="text-muted">No snapshot selected.</small>
          </div>
        )}
      </div>
      {activeSnapshotId && (
        <div className="mt-4">
          <FormLabel
            htmlFor="snapshot-list"
            description="All available snapshots. Delete if needed."
          >
            Active Snapshot
          </FormLabel>
          <ul id="snapshot-list" className="list-group">
            {snapshots.map(
              (snapshot) =>
                snapshot.id === activeSnapshotId && (
                  <li
                    key={snapshot.id}
                    className={`list-group-item d-flex justify-content-between align-items-center${
                      snapshot.id === activeSnapshotId
                        ? ' active bg-success bg-opacity-10'
                        : ''
                    }`}
                  >
                    <span>{snapshot.name}</span>
                    <Badge bg="success" className="text-white">
                      Active
                    </Badge>
                  </li>
                ),
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

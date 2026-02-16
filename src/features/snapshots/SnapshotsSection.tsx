import { AccordionSection } from '@/components/AccordionSection'
import { Button } from 'react-bootstrap'
import { sileo } from 'sileo'
import { IconReset } from '../../assets/IconReset'
import { useSnapshots } from '../../context/SnapshotsContext'
import { SnapshotDropdown } from './SnapshotDropdown'

export const SnapshotsSection = ({
  snapshots,
  onSnapshotChange,
}: {
  snapshots: Record<string, string>[]
  onSnapshotChange: (snapshot: string | null) => void
}) => {
  const { changeActiveSnapshotId } = useSnapshots()

  const resetActiveSnapshot = () => {
    onSnapshotChange(null)
    changeActiveSnapshotId(null)
    sileo.success({
      title: `Snapshot reset`,
      description: `The active snapshot has been reset.`,
      icon: '🔄',
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
    <AccordionSection
      title="Snapshots"
      description="Use a snapshot to set your context, storage, and cookies state"
    >
      <div className="">
        <div className="d-flex justify-content-end align-items-center">
          <Button
            variant="outline-info"
            size="sm"
            onClick={resetActiveSnapshot}
          >
            <IconReset />
            Reset Active Snapshot
          </Button>
        </div>
      </div>
      {snapshots.length > 0 && (
        <div className="mb-3">
          <SnapshotDropdown snapshots={snapshots} onSelect={onSnapshotChange} />
        </div>
      )}
    </AccordionSection>
  )
}

import { FormLabel } from '@/ui/FormLabel'

interface PositionSettingsProps {
  position: 'left' | 'right'
  onChange: (position: 'left' | 'right') => void
}

export const PositionSettings = ({
  position,
  onChange,
}: PositionSettingsProps) => {
  return (
    <div className="d-flex gap-2 justify-content-between align-items-center mb-2">
      <FormLabel
        isHideSpaceBelow
        description="Controls both drawer and trigger button position"
      >
        Drawer Position
      </FormLabel>
      <div className="btn-group" role="group">
        <input
          type="radio"
          className="btn-check"
          name="position"
          id="position-left"
          checked={position === 'left'}
          onChange={() => onChange('left')}
        />
        <label
          className="btn btn-outline-primary flex-fill btn-sm"
          htmlFor="position-left"
        >
          Left
        </label>
        <input
          type="radio"
          className="btn-check"
          name="position"
          id="position-right"
          checked={position === 'right'}
          onChange={() => onChange('right')}
        />
        <label
          className="btn btn-outline-primary flex-fill btn-sm"
          htmlFor="position-right"
        >
          Right
        </label>
      </div>
    </div>
  )
}

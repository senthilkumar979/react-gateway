import type { Settings } from '@/types/settings.types'
import { FormLabel } from '@/ui/FormLabel'

interface ChaosSettingsProps {
  chaos: Settings['chaos']
  onUpdate: (chaos: Settings['chaos']) => void
}

export const ChaosSettings = ({ chaos, onUpdate }: ChaosSettingsProps) => {
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="flex-grow-1">
          <FormLabel
            isHideSpaceBelow
            description="Test error handling and edge cases in your application"
          >
            Enable Chaos Mode
          </FormLabel>
        </div>
        <div className="form-check form-switch ms-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={chaos.enabled}
            onChange={(e) =>
              onUpdate({
                ...chaos,
                enabled: e.target.checked,
              })
            }
          />
        </div>
      </div>
      {chaos.enabled && (
        <div className="ps-5">
          <div className="mt-3 ps-3 border-start border-2 border-primary">
            <div className="d-flex align-items-center justify-content-between">
              <div className="flex-grow-1">
                <FormLabel
                  isHideSpaceBelow
                  description="Wrap components with ChaosBoundary to test error boundaries"
                >
                  Throw Error in Component
                </FormLabel>
              </div>
              <div className="form-check form-switch ms-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={chaos.throwError}
                  onChange={(e) =>
                    onUpdate({
                      ...chaos,
                      throwError: e.target.checked,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

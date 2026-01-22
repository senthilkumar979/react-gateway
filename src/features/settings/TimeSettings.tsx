import type { Settings } from '@/types/settings.types'
import { FormLabel } from '@/ui/FormLabel'

interface TimeSettingsProps {
  timeFreeze: Settings['timeFreeze']
  timeOffset: Settings['timeOffset']
  onUpdate: (updates: Partial<Settings>) => void
}

export const TimeSettings = ({
  timeFreeze,
  timeOffset,
  onUpdate,
}: TimeSettingsProps) => {
  return (
    <div>
      <div className="mb-3">
        <div className="d-flex align-items-center justify-content-between">
          <div className="flex-grow-1">
            <FormLabel description="Lock all Date() and Date.now() calls to a specific time">
              Freeze Time & Date
            </FormLabel>
          </div>
          <div className="form-check form-switch ms-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={timeFreeze.enabled}
              onChange={(e) =>
                onUpdate({
                  timeFreeze: {
                    ...timeFreeze,
                    enabled: e.target.checked,
                  },
                })
              }
            />
          </div>
        </div>
        {timeFreeze.enabled && (
          <div className="ps-5">
            <div className="mt-3 ps-3 border-start border-2 border-primary">
              <FormLabel
                htmlFor="frozen-date"
                description="All Date() and Date.now() calls will return this time"
              >
                Frozen Date & Time
              </FormLabel>
              <input
                id="frozen-date"
                type="datetime-local"
                className="form-control"
                value={
                  timeFreeze.frozenDate
                    ? timeFreeze.frozenDate.substring(0, 16)
                    : ''
                }
                onChange={(e) =>
                  onUpdate({
                    timeFreeze: {
                      enabled: true,
                      frozenDate: e.target.value
                        ? `${e.target.value}:00`
                        : null,
                    },
                  })
                }
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="flex-grow-1">
            <FormLabel description="Add or subtract days from the current date">
              Offset Time (+/- days)
            </FormLabel>
          </div>
          <div className="form-check form-switch ms-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={timeOffset.enabled}
              onChange={(e) =>
                onUpdate({
                  timeOffset: {
                    ...timeOffset,
                    enabled: e.target.checked,
                  },
                })
              }
            />
          </div>
        </div>
        {timeOffset.enabled && (
          <div className="ps-5">
            <div className="mt-3 ps-3 border-start border-2 border-primary">
              <FormLabel
                htmlFor="offset-days"
                description="Positive numbers add days, negative subtracts"
              >
                Offset Days
              </FormLabel>
              <input
                id="offset-days"
                type="number"
                className="form-control"
                value={timeOffset.offsetDays}
                onChange={(e) =>
                  onUpdate({
                    timeOffset: {
                      enabled: true,
                      offsetDays: parseInt(e.target.value, 10) || 0,
                    },
                  })
                }
                placeholder="Days (e.g., -10 or +10)"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

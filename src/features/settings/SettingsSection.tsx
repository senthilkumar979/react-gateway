import { IconClock } from '@/assets/IconClock'
import { IconInfoCircle } from '@/assets/IconInfoCircle'
import { IconPlus } from '@/assets/IconPlus'
import { AccordionSection } from '@/components/AccordionSection'
import { useGateway } from '@/context/GatewayContext'
import { useSettings } from '@/context/SettingsContext'
import { ChaosSettings } from './ChaosSettings'
import { PositionSettings } from './PositionSettings'
import { TimeSettings } from './TimeSettings'

export const SettingsSection = () => {
  const { settings, updateSettings } = useSettings()
  const { setDrawerPosition, setTriggerPosition } = useGateway()

  const handlePositionChange = (position: 'left' | 'right') => {
    updateSettings({ position })
    setDrawerPosition(position)
    setTriggerPosition(position)
  }

  return (
    <AccordionSection title="General Settings">
      <div className="settings-container">
        <div className="settings-group">
          <div className="settings-header">
            <IconPlus />
            <span className="settings-title">DevTool Position</span>
          </div>
          <PositionSettings
            position={settings.position}
            onChange={handlePositionChange}
          />
        </div>

        <div className="settings-divider"></div>

        <div className="settings-group">
          <div className="settings-header">
            <IconClock />
            <span className="settings-title">Time Manipulation</span>
          </div>
          <TimeSettings
            timeFreeze={settings.timeFreeze}
            timeOffset={settings.timeOffset}
            onUpdate={(updates) => updateSettings(updates)}
          />
        </div>

        <div className="settings-divider"></div>

        <div className="settings-group">
          <div className="settings-header">
            <IconInfoCircle />
            <span className="settings-title">Chaos Testing</span>
          </div>
          <ChaosSettings
            chaos={settings.chaos}
            onUpdate={(chaos) => updateSettings({ chaos })}
          />
        </div>
      </div>
    </AccordionSection>
  )
}

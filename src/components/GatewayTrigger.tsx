import { IconGrid } from '@/assets/IconGrid'
import { useGateway } from '../context/GatewayContext'
import { useSettings } from '../context/SettingsContext'

export const GatewayTrigger = () => {
  const { settings } = useSettings()
  const { state, setIsOpen } = useGateway()

  const positionClass =
    settings.position === 'left'
      ? 'position-fixed bottom-0 start-0 m-3'
      : 'position-fixed bottom-0 end-0 m-3'

  return (
    <button
      type="button"
      className={`btn btn-primary rounded-circle ${positionClass}`}
      style={{ width: '56px', height: '56px', zIndex: 9999 }}
      onClick={() => setIsOpen(!state.isOpen)}
      aria-label="Toggle Gateway Dev Tools"
    >
      <IconGrid />
    </button>
  )
}

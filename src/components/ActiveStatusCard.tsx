import { IconCross } from '@/assets/IconCross'
import { IconTrash } from '@/assets/IconTrash'
import { useGateway } from '@/context/GatewayContext'
import { useScenarios } from '@/context/ScenariosContext'
import { useSettings } from '@/context/SettingsContext'
import { useSnapshots } from '@/context/SnapshotsContext'
import { useUIFlows } from '@/context/UIFlowsContext'
import { Button } from 'react-bootstrap'

export const ActiveStatusCard = () => {
  const { state, setActiveScenarioId } = useGateway()
  const { getScenario } = useScenarios()
  const { activeSnapshotId, changeActiveSnapshotId } = useSnapshots()
  const { settings, updateSettings } = useSettings()
  const { isRecording, stopRecording } = useUIFlows()

  const activeScenario = state.activeScenarioId
    ? getScenario(state.activeScenarioId)
    : null

  const activeSnapshot = activeSnapshotId

  const hasActiveSettings =
    settings.timeFreeze.enabled || settings.timeOffset.enabled || settings.chaos

  const hasAnyActive =
    activeScenario || activeSnapshot || hasActiveSettings || isRecording

  if (!hasAnyActive) return null

  const handleClearSnapshot = () => {
    changeActiveSnapshotId(null)
  }

  const handleClearScenario = () => {
    setActiveScenarioId(null)
  }

  const handleClearTimeFreeze = () => {
    updateSettings({
      timeFreeze: {
        enabled: false,
        frozenDate: null,
      },
    })
  }

  const handleClearTimeOffset = () => {
    updateSettings({
      timeOffset: {
        enabled: false,
        offsetDays: 0,
      },
    })
  }

  const handleClearChaos = () => {
    updateSettings({
      chaos: false,
    })
  }

  const handleStopRecording = () => {
    stopRecording()
  }

  const handleResetAll = () => {
    changeActiveSnapshotId(null)
    setActiveScenarioId(null)
    updateSettings({
      timeFreeze: {
        enabled: false,
        frozenDate: null,
      },
      timeOffset: {
        enabled: false,
        offsetDays: 0,
      },
      chaos: false,
    })
    if (isRecording) {
      stopRecording()
    }
  }

  return (
    <div className="card mb-3 border-primary">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Active Status</h6>
        <Button
          variant="outline-light"
          size="sm"
          onClick={handleResetAll}
          className="d-flex align-items-center gap-1"
        >
          <IconTrash width={14} height={14} />
          Reset All
        </Button>
      </div>
      <div className="card-body">
        {activeSnapshot && (
          <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
            <div>
              <strong>Snapshot:</strong> {activeSnapshotId}
            </div>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleClearSnapshot}
              className="d-flex align-items-center"
            >
              <IconCross width={14} height={14} />
            </Button>
          </div>
        )}

        {activeScenario && (
          <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
            <div>
              <strong>Scenario:</strong> {activeScenario.name}
            </div>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleClearScenario}
              className="d-flex align-items-center"
            >
              <IconCross width={14} height={14} />
            </Button>
          </div>
        )}

        {settings.timeFreeze.enabled && (
          <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
            <div>
              <strong>Time Freeze:</strong>{' '}
              {settings.timeFreeze.frozenDate
                ? new Date(settings.timeFreeze.frozenDate).toLocaleString()
                : 'Enabled'}
            </div>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleClearTimeFreeze}
              className="d-flex align-items-center"
            >
              <IconCross width={14} height={14} />
            </Button>
          </div>
        )}

        {settings.timeOffset.enabled && (
          <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
            <div>
              <strong>Time Offset:</strong> {settings.timeOffset.offsetDays} day
              {settings.timeOffset.offsetDays !== 1 ? 's' : ''}
            </div>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleClearTimeOffset}
              className="d-flex align-items-center"
            >
              <IconCross width={14} height={14} />
            </Button>
          </div>
        )}

        {settings.chaos && (
          <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
            <div>
              <strong>Chaos Mode:</strong>{' '}
              {settings.chaos ? 'Throw Error' : 'Enabled'}
            </div>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleClearChaos}
              className="d-flex align-items-center"
            >
              <IconCross width={14} height={14} />
            </Button>
          </div>
        )}

        {isRecording && (
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong className="text-danger">Recording:</strong> UI Flow
            </div>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleStopRecording}
              className="d-flex align-items-center"
            >
              <IconCross width={14} height={14} />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

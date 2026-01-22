import { GatewayDrawer } from '@/components/GatewayDrawer'
import { GatewayTrigger } from '@/components/GatewayTrigger'
import { GatewayProvider, useGateway } from '@/context/GatewayContext'
import { RenderAnalyzerProvider } from '@/context/RenderAnalyzerContext'
import { ScenariosProvider, useScenarios } from '@/context/ScenariosContext'
import { SettingsProvider, useSettings } from '@/context/SettingsContext'
import { SnapshotsProvider, useSnapshots } from '@/context/SnapshotsContext'
import { UIFlowsProvider } from '@/context/UIFlowsContext'
import { PersonasSection } from '@/features/personas/PersonasSection'
import { RenderAnalyzerSection } from '@/features/renderAnalyzer/RenderAnalyzerSection'
import { ScenariosSection } from '@/features/scenarios/ScenariosSection'
import { SettingsSection } from '@/features/settings/SettingsSection'
import { SnapshotsSection } from '@/features/snapshots/SnapshotsSection'
import { UIFlowsSection } from '@/features/uiFlows/UIFlowsSection'
import '@/styles.scss'
import type { ReactGatewayProps } from '@/types/ReactGateway.types'
import { startInterception, stopInterception } from '@/utils/apiInterceptor'
import { restoreSnapshot } from '@/utils/storageManager'
import {
  freezeTime,
  initializeTimeManipulation,
  setTimeOffset,
} from '@/utils/timeFreeze'
import { useEffect } from 'react'
import { Accordion } from 'react-bootstrap'
import { ErrorBoundary } from 'react-error-boundary'
import { GenericError } from './components/GenericError'

const GatewayContent = ({
  clientApp,
  onSnapshotChange,
  scenarioComponent,
  fallbackComponent,
}: ReactGatewayProps) => {
  const { state, setDrawerPosition, setTriggerPosition } = useGateway()
  const { getScenario } = useScenarios()
  const { getSnapshot, activeSnapshotId } = useSnapshots()
  const { settings } = useSettings()

  useEffect(() => {
    if (state.drawerPosition !== settings.position) {
      setDrawerPosition(settings.position)
    }
    if (state.triggerPosition !== settings.position) {
      setTriggerPosition(settings.position)
    }
  }, [settings.position, state.drawerPosition, state.triggerPosition, setDrawerPosition, setTriggerPosition])

  useEffect(() => {
    initializeTimeManipulation()
  }, [])

  useEffect(() => {
    const scenario = state.activeScenarioId
      ? getScenario(state.activeScenarioId)
      : null
    if (scenario) {
      startInterception(scenario)
    } else {
      stopInterception()
    }

    return () => {
      stopInterception()
    }
  }, [state.activeScenarioId, getScenario])

  useEffect(() => {
    if (activeSnapshotId) {
      const snapshot = getSnapshot(activeSnapshotId)
      if (snapshot) {
        restoreSnapshot(snapshot)
        onSnapshotChange?.(snapshot)
      }
    }
  }, [activeSnapshotId, getSnapshot, onSnapshotChange])

  useEffect(() => {
    if (settings.timeFreeze.enabled && settings.timeFreeze.frozenDate) {
      freezeTime(settings.timeFreeze.frozenDate)
    } else {
      freezeTime(null)
    }
  }, [settings.timeFreeze])

  useEffect(() => {
    setTimeOffset(settings.timeOffset.enabled, settings.timeOffset.offsetDays)
  }, [settings.timeOffset])

  return (
    <>
      <ErrorBoundary FallbackComponent={fallbackComponent ?? GenericError}>
        {clientApp}
      </ErrorBoundary>
      <GatewayTrigger />
      <GatewayDrawer>
        <Accordion defaultActiveKey="scenarios" id="gateway-accordion">
          <ScenariosSection />
          <SnapshotsSection />
          <SettingsSection />
          <RenderAnalyzerSection />
          <UIFlowsSection />
          <PersonasSection scenarioComponent={scenarioComponent} />
        </Accordion>
      </GatewayDrawer>
    </>
  )
}

export const ReactGateway = ({ position, ...props }: ReactGatewayProps) => {
  return (
    <GatewayProvider>
      <ScenariosProvider>
        <SnapshotsProvider>
          <SettingsProvider initialPosition={position}>
            <RenderAnalyzerProvider>
              <UIFlowsProvider>
                <GatewayContent {...props} />
              </UIFlowsProvider>
            </RenderAnalyzerProvider>
          </SettingsProvider>
        </SnapshotsProvider>
      </ScenariosProvider>
    </GatewayProvider>
  )
}

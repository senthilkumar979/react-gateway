import { GatewayDrawer } from '@/components/GatewayDrawer'
import { GatewayTrigger } from '@/components/GatewayTrigger'
import { GatewayProvider, useGateway } from '@/context/GatewayContext'
import { RenderAnalyzerProvider } from '@/context/RenderAnalyzerContext'
import { ScenariosProvider, useScenarios } from '@/context/ScenariosContext'
import { SettingsProvider, useSettings } from '@/context/SettingsContext'
import { SnapshotsProvider } from '@/context/SnapshotsContext'
import { UIFlowsProvider } from '@/context/UIFlowsContext'
import { ChaosTestingSection } from '@/features/chaosTesting/ChaosTestingSection'
import { ScenariosSection } from '@/features/scenarios/ScenariosSection'
import { SettingsSection } from '@/features/settings/SettingsSection'
import { SnapshotsSection } from '@/features/snapshots/SnapshotsSection'
import { UIFlowsSection } from '@/features/uiFlows/UIFlowsSection'
import '@/styles.scss'
import type { ReactGatewayProps } from '@/types/ReactGateway.types'
import { startInterception, stopInterception } from '@/utils/apiInterceptor'
import {
  freezeTime,
  initializeTimeManipulation,
  setTimeOffset,
} from '@/utils/timeFreeze'
import { useEffect } from 'react'
import { Accordion } from 'react-bootstrap'
import { Toaster } from 'sileo'
import { ChaosError } from './features/chaosTesting/ChaosError'
import { GatewayErrorBoundary } from './features/errorBoundary/GatewayErrorBoundary'

const GatewayContent = ({
  clientApp,
  onSnapshotChange,
  responseList,
  snapshots,
}: ReactGatewayProps) => {
  const { state } = useGateway()
  const { getScenario } = useScenarios()
  const { settings } = useSettings()

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
      {clientApp}
      <ChaosError />
      {settings.chaos && <div>Chaos mode is enabled</div>}
      <GatewayErrorBoundary>
        <GatewayTrigger />
        <GatewayDrawer>
          <div data-canvas-position={settings.position}>
            <Toaster
              position={'bottom-center'}
              offset={{
                bottom: 20,
                right: settings.position === 'right' ? '15%' : 0,
                left: settings.position === 'left' ? '45%' : 0,
              }}
            />
          </div>
          <Accordion defaultActiveKey="scenarios" id="gateway-accordion">
            <ScenariosSection responseList={responseList ?? []} />
            {snapshots && snapshots.length > 0 && onSnapshotChange && (
              <SnapshotsSection
                snapshots={snapshots}
                onSnapshotChange={onSnapshotChange}
              />
            )}
            <SettingsSection />
            <ChaosTestingSection />
            <UIFlowsSection />
          </Accordion>
          {process.env.NODE_ENV === 'development' && (
            <img
              src="/dev.gif"
              alt="Dev GIF"
              className="dev-gif"
              width={300}
              height={150}
            />
          )}
        </GatewayDrawer>
      </GatewayErrorBoundary>
    </>
  )
}

export const ReactGateway = (props: ReactGatewayProps) => {
  return (
    <GatewayProvider>
      <ScenariosProvider>
        <SnapshotsProvider>
          <SettingsProvider initialPosition={'right'}>
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

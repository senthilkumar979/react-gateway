import { ComponentType, PropsWithChildren, ReactNode } from 'react'
import type { FallbackProps } from 'react-error-boundary'
import type { Snapshot } from './Snapshots.types'

export interface ReactGatewayProps extends PropsWithChildren {
  clientApp: ReactNode
  components?: string[]
  onSnapshotChange?: (snapshot: Snapshot) => void
  scenarioComponent?: React.ComponentType
  position?: 'left' | 'right'
  fallbackComponent?: ComponentType<FallbackProps>
  costAnalyzerComponent?: ComponentType<{ componentName: string }>
}

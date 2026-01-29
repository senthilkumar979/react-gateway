import { PropsWithChildren, ReactNode } from 'react'
import type { Snapshot } from './Snapshots.types'

export interface ReactGatewayProps extends PropsWithChildren {
  clientApp: ReactNode
  onSnapshotChange?: (snapshot: Snapshot) => void
  responseList?: Record<string, unknown>[]
}

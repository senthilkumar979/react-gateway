import { PropsWithChildren, ReactNode } from 'react'

export interface ReactGatewayProps extends PropsWithChildren {
  clientApp: ReactNode
  onSnapshotChange?: (snapshot: string | null) => void
  responseList?: Record<string, unknown>[]
  snapshots?: Record<string, string>[]
}

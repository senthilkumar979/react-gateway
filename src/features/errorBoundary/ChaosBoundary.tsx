import { useSettings } from '@/context/SettingsContext'
import type { ReactNode } from 'react'

interface ChaosBoundaryProps {
  children: ReactNode
}

export const ChaosBoundary = ({ children }: ChaosBoundaryProps) => {
  const { settings } = useSettings()

  if (settings.chaos.enabled && settings.chaos.throwError) {
    throw new Error('Chaos render failure')
  }

  return <>{children}</>
}

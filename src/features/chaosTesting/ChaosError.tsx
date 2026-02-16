import { useSettings } from '@/context/SettingsContext'

export const ChaosError = () => {
  const { settings } = useSettings()

  if (settings.chaos) {
    throw new Error('Chaos render failure')
  }

  return <>{settings.chaos ? <div>{settings.chaos.message}</div> : null}</>
}

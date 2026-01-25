import { AccordionSection } from '@/components/AccordionSection'
import { useSettings } from '@/context/SettingsContext'
import { ChaosSettings } from '@/features/settings/ChaosSettings'

export const ChaosTestingSection = () => {
  const { settings, updateSettings } = useSettings()

  return (
    <AccordionSection
      title="Chaos Testing"
      description="Test error handling and edge cases in your application"
    >
      <ChaosSettings
        chaos={settings.chaos}
        onUpdate={(chaos) => updateSettings({ chaos })}
      />
    </AccordionSection>
  )
}

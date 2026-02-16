import { AccordionSection } from '@/components/AccordionSection'
import { ChaosSettings } from '@/features/settings/ChaosSettings'

export const ChaosTestingSection = () => {
  return (
    <AccordionSection
      title="Chaos Testing"
      description="Test error handling and edge cases in your application"
    >
      <ChaosSettings />
    </AccordionSection>
  )
}

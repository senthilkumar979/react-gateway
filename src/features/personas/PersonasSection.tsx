import { AccordionSection } from '@/components/AccordionSection'
import { ScenarioGrid } from './ScenarioGrid'

interface PersonasSectionProps {
  scenarioComponent?: React.ComponentType
}

export const PersonasSection = ({
  scenarioComponent,
}: PersonasSectionProps) => {
  if (!scenarioComponent) {
    return (
      <AccordionSection
        title="Persona Based Component Check"
        description="Test components with different user personas and scenarios"
      >
        <p className="text-muted small">
          No scenario component provided. Pass scenarioComponent prop to
          ReactGateway to use this feature.
        </p>
      </AccordionSection>
    )
  }

  return (
    <AccordionSection
      title="Persona Based Component Check"
      description="Test components with different user personas and scenarios"
    >
      <ScenarioGrid scenarioComponent={scenarioComponent} />
    </AccordionSection>
  )
}

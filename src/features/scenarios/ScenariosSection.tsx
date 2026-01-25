import { AccordionSection } from '@/components/AccordionSection'
import { useScenarios } from '@/context/ScenariosContext'
import type { Scenario } from '@/types/Scenarios.types'
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { IconPlus } from '../../assets/IconPlus'
import { ImportButton } from './ImportButton'
import { ScenarioAccordion } from './ScenarioAccordion'
import { ScenarioForm } from './ScenarioForm'

export const ScenariosSection = () => {
  const { addScenario, updateScenario } = useScenarios()
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleSave = (
    scenarioData: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    if (editingScenario) {
      updateScenario(editingScenario.id, scenarioData)
      setEditingScenario(null)
    } else {
      addScenario(scenarioData)
    }
    setShowForm(false)
  }

  const handleEdit = (scenario: Scenario) => {
    setEditingScenario(scenario)
    setShowForm(true)
  }

  return (
    <AccordionSection
      title="Scenarios"
      description="Create and manage API response scenarios to simulate different backend behaviors"
      defaultOpen={true}
    >
      <div className="mb-3 d-flex justify-content-end gap-2">
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => {
            setEditingScenario(null)
            setShowForm(true)
          }}
        >
          <IconPlus width={16} height={16} />
          Create Scenario
        </Button>
        <ImportButton />
      </div>
      {showForm && (
        <div className="mb-4">
          <ScenarioForm
            scenario={editingScenario}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false)
              setEditingScenario(null)
            }}
          />
        </div>
      )}
      <ScenarioAccordion onEdit={handleEdit} />
    </AccordionSection>
  )
}

import { AccordionSection } from '@/components/AccordionSection'
import { useGateway } from '@/context/GatewayContext'
import { useScenarios } from '@/context/ScenariosContext'
import type { Scenario } from '@/types/Scenarios.types'
import { useState } from 'react'
import { ScenarioDropdown } from './ScenarioDropdown'
import { ScenarioForm } from './ScenarioForm'
import { Button } from 'react-bootstrap'
import { IconPlus } from '../../assets/IconPlus'

export const ScenariosSection = () => {
  const {
    scenarios,
    addScenario,
    updateScenario,
    deleteScenario,
  } = useScenarios()
  const { state, setActiveScenarioId } = useGateway()
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

  const handleSelect = (scenarioId: string | null) => {
    setActiveScenarioId(scenarioId)
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
      {scenarios?.length > 0 && <div className="mb-3">
        <ScenarioDropdown
          scenarios={scenarios}
          selectedId={state.activeScenarioId}
          onSelect={handleSelect}
        />
      </div>}
      <div className="mb-3 d-flex justify-content-end">
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
      </div>
      {scenarios.length > 0 && (
        <div className="mb-3">
          <h6>Existing Scenarios</h6>
          <div className="list-group">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{scenario.name}</strong>
                    {scenario.description && (
                      <div className="small text-muted">
                        {scenario.description}
                      </div>
                    )}
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEdit(scenario)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteScenario(scenario.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showForm && (
        <div className="mb-3">
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
    </AccordionSection>
  )
}

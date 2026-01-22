import type { Scenario } from '@/types/scenarios.types'
import { FormLabel } from '@/ui/FormLabel'
import { useScenarios } from '../../context/ScenariosContext'
import { ImportExportButtons } from './ImportExportButtons'

interface ScenarioDropdownProps {
  scenarios: Scenario[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export const ScenarioDropdown = ({
  scenarios,
  selectedId,
  onSelect,
}: ScenarioDropdownProps) => {
  const selectedScenario = scenarios.find((s) => s.id === selectedId)
  const { addScenario } = useScenarios()

  return (
    <div>
      <FormLabel
        htmlFor="scenario-select"
        description="Select a scenario to activate API request interception"
      >
        Active Scenario
      </FormLabel>
      <div className="mb-2 d-flex gap-2 justify-content-between align-items-center">
        <select
          id="scenario-select"
          className="form-select"
          value={selectedId || ''}
          onChange={(e) => onSelect(e.target.value || null)}
        >
          <option value="">None</option>
          {scenarios.map((scenario) => (
            <option key={scenario.id} value={scenario.id}>
              {scenario.name}
            </option>
          ))}
        </select>
        <ImportExportButtons
          scenarios={scenarios}
          onImport={(imported) => {
            imported.forEach((scenario) => {
              addScenario({
                name: scenario.name,
                description: scenario.description,
                requests: scenario.requests,
              })
            })
          }}
        />
      </div>
      {selectedScenario && (
        <div className="mt-2">
          <small className="text-muted">{selectedScenario.description}</small>
        </div>
      )}
    </div>
  )
}

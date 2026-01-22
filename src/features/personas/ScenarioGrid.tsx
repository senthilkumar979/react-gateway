import { useState } from 'react'

interface ScenarioGridProps {
  scenarioComponent: React.ComponentType
}

export const ScenarioGrid = ({ scenarioComponent: ScenarioComponent }: ScenarioGridProps) => {
  const [scenarios, setScenarios] = useState<string[]>(['Scenario 1'])

  const addScenario = () => {
    if (scenarios.length < 3) {
      setScenarios([...scenarios, `Scenario ${scenarios.length + 1}`])
    }
  }

  const removeScenario = (index: number) => {
    setScenarios(scenarios.filter((_, i) => i !== index))
  }

  const updateScenarioName = (index: number, name: string) => {
    setScenarios(scenarios.map((s, i) => (i === index ? name : s)))
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6>Scenarios (Max 3)</h6>
        {scenarios.length < 3 && (
          <button className="btn btn-sm btn-primary" onClick={addScenario}>
            Add Scenario
          </button>
        )}
      </div>
      <div className="row g-3">
        {scenarios.map((name, index) => (
          <div key={index} className="col-md-4">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={name}
                  onChange={(e) => updateScenarioName(index, e.target.value)}
                  style={{ width: 'auto', display: 'inline-block' }}
                />
                {scenarios.length > 1 && (
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeScenario(index)}
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="card-body">
                <div style={{ minHeight: '200px' }}>
                  <ScenarioComponent />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

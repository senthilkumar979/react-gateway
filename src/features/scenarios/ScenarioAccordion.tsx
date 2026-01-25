import { useScenarios } from '@/context/ScenariosContext'
import { useState } from 'react'
import { Accordion, Badge, Button } from 'react-bootstrap'
import { IconCheck } from '../../assets/IconCheck'
import { useGateway } from '../../context/GatewayContext'
import { ScenarioDetailView } from './ScenarioDetailView'
import { Scenario } from '../../types/Scenarios.types'

export const ScenarioAccordion = ({ onEdit }: { onEdit: (scenario: Scenario) => void }) => {
  const { scenarios } = useScenarios()
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const { state, setActiveScenarioId } = useGateway()

  const handleSelect = (scenarioId: string | null) => {
    setActiveScenarioId(scenarioId)
  }

  if (scenarios.length === 0) {
    return (
      <div className="text-muted text-center py-3">No scenarios available.</div>
    )
  }

  const handleToggle = (key: string) => {
    setActiveKey(activeKey === key ? null : key)
  }

  return (
    <Accordion
      activeKey={activeKey ?? undefined}
      onSelect={(eventKey) => handleToggle(eventKey as string)}
      style={{ maxWidth: 750, margin: '0 auto' }}
      className="scenarios-accordion"
    >
      {scenarios.map((scenario) => {
        const key = scenario.id
        return (
          <Accordion.Item eventKey={key} key={key}>
            <Accordion.Header>
              <div
                className="d-flex align-items-center flex-grow-1"
                style={{ minWidth: 0 }}
              >
                <div className="fw-semibold text-truncate d-flex align-items-start gap-2 flex-column">
                  {scenario.name}
                  {scenario.description && (
                    <span
                      className="text-muted text-truncate"
                      style={{ maxWidth: 260, fontSize: 14 }}
                    >
                      {scenario.description}
                    </span>
                  )}
                </div>
                <span
                  className="ms-auto me-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {scenario.id !== state.activeScenarioId ? (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleSelect(scenario.id)}
                    >
                      Activate
                    </Button>
                  ) : (
                    <Badge bg="dark" className="text-white">
                      <IconCheck width={16} height={16} /> Active
                    </Badge>
                  )}
                </span>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <ScenarioDetailView scenario={scenario} onEdit={onEdit} />
            </Accordion.Body>
          </Accordion.Item>
        )
      })}
    </Accordion>
  )
}

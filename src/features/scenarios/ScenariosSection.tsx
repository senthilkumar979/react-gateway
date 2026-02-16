import { AccordionSection } from '@/components/AccordionSection'
import { useScenarios } from '@/context/ScenariosContext'
import type { RequestConfig, Scenario } from '@/types/Scenarios.types'
import { useState } from 'react'
import { Alert, Button } from 'react-bootstrap'
import { IconPlus } from '../../assets/IconPlus'
import { IconReset } from '../../assets/IconReset'
import { useGateway } from '../../context/GatewayContext'
import { ImportButton } from './ImportButton'
import { ScenarioAccordion } from './ScenarioAccordion'
import { ScenarioForm } from './ScenarioForm'

export const ScenariosSection = ({
  responseList,
}: {
  responseList: Record<string, unknown>[]
}) => {
  const { addScenario, updateScenario } = useScenarios()
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const { setActiveScenarioId } = useGateway()

  const scrollToTop = () => {
    document
      .getElementById('gateway-accordion')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSave = (
    scenarioData: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    if (!scenarioData.name?.trim()) {
      setAlertMessage('Scenario name is required.')
      return
    }

    if (
      !Array.isArray(scenarioData.requests) ||
      scenarioData.requests.length === 0
    ) {
      setAlertMessage('Scenario must contain at least one request.')
      return
    }

    const mandatoryFields = ['name', 'url']
    for (let i = 0; i < scenarioData.requests.length; i++) {
      const request = scenarioData.requests[i]
      for (const field of mandatoryFields) {
        const value = request[field as keyof RequestConfig]
        if (typeof value !== 'string' || !value.trim()) {
          scrollToTop()
          setAlertMessage(
            `Request #${i + 1} is missing required field: ${
              field[0].toUpperCase() + field.slice(1)
            }.`,
          )
          return
        }
      }
    }

    setAlertMessage(null)

    if (editingScenario) {
      updateScenario(editingScenario.id, scenarioData)
      setEditingScenario(null)
    } else {
      addScenario(scenarioData)
    }
    setShowForm(false)
  }

  const handleEdit = (scenario: Scenario) => {
    scrollToTop()
    setEditingScenario(scenario)
    setShowForm(true)
  }

  const resetActiveScenario = () => {
    setActiveScenarioId(null)
  }

  return (
    <AccordionSection
      title="Scenarios"
      description="Create and manage API response scenarios to simulate different backend behaviors"
      defaultOpen={true}
    >
      {alertMessage && (
        <Alert
          variant="danger"
          className="mb-3"
          onClose={() => setAlertMessage(null)}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}
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
        <Button variant="outline-info" size="sm" onClick={resetActiveScenario}>
          <IconReset />
          Reset Active Scenario
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
              setAlertMessage(null)
            }}
            responseList={responseList}
          />
        </div>
      )}
      <ScenarioAccordion onEdit={handleEdit} responseList={responseList}/>
    </AccordionSection>
  )
}

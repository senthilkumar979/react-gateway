import { FormLabel } from '@/ui/FormLabel'
import { Scenario } from '../../types/Scenarios.types'
import { RequestConfigForm } from './RequestConfigForm'
import { ScenarioActions } from './ScenarioActions'

export const ScenarioDetailView = ({
  scenario,
  onEdit,
}: {
  scenario: Scenario
  onEdit: (scenario: Scenario) => void
}) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <FormLabel description="Configure API requests to intercept and manipulate">
          API Requests
        </FormLabel>
        <ScenarioActions scenario={scenario} onEdit={onEdit} />
      </div>
      {scenario.requests?.map((request) => (
        <RequestConfigForm
          key={request.name}
          isReadonly={true}
          request={request}
        />
      ))}
    </div>
  )
}

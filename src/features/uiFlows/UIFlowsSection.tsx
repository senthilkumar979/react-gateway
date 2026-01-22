import { useState } from 'react'
import { AccordionSection } from '@/components/AccordionSection'
import { useUIFlows } from '@/context/UIFlowsContext'
import { RecordingControls } from './RecordingControls'
import { FlowsList } from './FlowsList'
import { ImportExportButtons } from './ImportExportButtons'
import { useUIRecorder } from '@/hooks/useUIRecorder'
import { FormLabel } from '@/ui/FormLabel'

export const UIFlowsSection = () => {
  const { flows, addFlow } = useUIFlows()
  const { isRecording, events, startRecording, stopRecording, clearEvents } = useUIRecorder()
  const [flowName, setFlowName] = useState('')

  const handleSave = () => {
    if (!flowName.trim() || events.length === 0) return

    addFlow({
      name: flowName.trim(),
      events,
    })
    setFlowName('')
    clearEvents()
  }

  return (
    <AccordionSection title="Record UI Flows and Replay">
      <RecordingControls
        isRecording={isRecording}
        onStart={startRecording}
        onStop={stopRecording}
        eventsCount={events.length}
      />
      {events.length > 0 && !isRecording && (
        <div className="mt-3">
          <FormLabel
            htmlFor="flow-name"
            description="Save the recorded flow with a name for later replay"
            required
          >
            Flow Name
          </FormLabel>
          <div className="input-group">
            <input
              id="flow-name"
              type="text"
              className="form-control"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              placeholder="Flow name"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSave()
                }
              }}
            />
            <button className="btn btn-primary" onClick={handleSave}>
              Save Flow
            </button>
          </div>
        </div>
      )}
      <div className="mt-3">
        <FlowsList />
      </div>
      <div className="mt-3">
        <ImportExportButtons flows={flows} onImport={(imported) => {
          imported.forEach((flow) => {
            addFlow({
              name: flow.name,
              events: flow.events,
            })
          })
        }} />
      </div>
    </AccordionSection>
  )
}

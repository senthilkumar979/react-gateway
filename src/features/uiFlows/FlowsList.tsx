import { useState } from 'react'
import { useUIFlows } from '@/context/UIFlowsContext'
import { ReplayControls } from './ReplayControls'

export const FlowsList = () => {
  const { flows, deleteFlow } = useUIFlows()
  const [replayingFlowId, setReplayingFlowId] = useState<string | null>(null)

  if (flows.length === 0) {
    return <p className="text-muted small">No saved flows. Record a flow to get started.</p>
  }

  return (
    <div>
      <h6>Saved Flows</h6>
      <div className="list-group">
        {flows.map((flow) => (
          <div key={flow.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{flow.name}</strong>
                <br />
                <small className="text-muted">
                  {flow.events.length} events • Created:{' '}
                  {new Date(flow.createdAt).toLocaleString()}
                </small>
              </div>
              <div className="d-flex gap-2">
                <ReplayControls
                  flow={flow}
                  isReplaying={replayingFlowId === flow.id}
                  onReplayStart={() => setReplayingFlowId(flow.id)}
                  onReplayEnd={() => setReplayingFlowId(null)}
                />
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => deleteFlow(flow.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

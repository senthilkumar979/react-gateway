import type { RequestConfig } from '@/types/Scenarios.types'
import { FormLabel } from '@/ui/FormLabel'

interface RequestConfigFormProps {
  request: RequestConfig
  onUpdate: (updates: Partial<RequestConfig>) => void
  onRemove: () => void
  index?: number
}

export const RequestConfigForm = ({
  request,
  onUpdate,
  onRemove,
  index = 0,
}: RequestConfigFormProps) => {
  const prefix = `request-${index}`
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={request.isActive}
              onChange={(e) => onUpdate({ isActive: e.target.checked })}
            />
            <label className="form-check-label">Active</label>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
        <div className="mb-2">
          <FormLabel
            htmlFor={`${prefix}-name`}
            description="A descriptive name for this request"
          >
            Request Name
          </FormLabel>
          <input
            id={`${prefix}-name`}
            type="text"
            className="form-control form-control-sm"
            value={request.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="e.g., Get User Profile"
          />
        </div>
        <div className="mb-2">
          <FormLabel
            htmlFor={`${prefix}-url`}
            description="URL pattern to match. Supports regex patterns."
            tooltip="Use regex patterns like /api/users/.* to match multiple URLs"
          >
            URL Pattern
          </FormLabel>
          <input
            id={`${prefix}-url`}
            type="text"
            className="form-control form-control-sm"
            value={request.url}
            onChange={(e) => onUpdate({ url: e.target.value })}
            placeholder="e.g., /api/users/.*"
          />
        </div>
        <div className="row mb-2">
          <div className="col-md-6">
            <FormLabel
              htmlFor={`${prefix}-status`}
              description="HTTP status code to return"
            >
              Status Code
            </FormLabel>
            <input
              id={`${prefix}-status`}
              type="text"
              className="form-control form-control-sm"
              value={request.statusCode}
              onChange={(e) => onUpdate({ statusCode: e.target.value })}
              placeholder="200"
            />
          </div>
          <div className="col-md-6">
            <FormLabel
              htmlFor={`${prefix}-delay`}
              description="Delay before returning response"
            >
              Delay (ms)
            </FormLabel>
            <input
              id={`${prefix}-delay`}
              type="number"
              className="form-control form-control-sm"
              value={request.delayInMs}
              onChange={(e) =>
                onUpdate({ delayInMs: parseInt(e.target.value, 10) || 0 })
              }
              min="0"
            />
          </div>
        </div>
        <div>
          <FormLabel
            htmlFor={`${prefix}-response`}
            description="Custom JSON response body"
            tooltip="This will be returned as the response body when the URL pattern matches"
          >
            Custom Response (JSON)
          </FormLabel>
          <textarea
            id={`${prefix}-response`}
            className="form-control form-control-sm"
            rows={4}
            value={request.customResponse}
            onChange={(e) => onUpdate({ customResponse: e.target.value })}
            placeholder='{"message": "Custom response"}'
          />
        </div>
      </div>
    </div>
  )
}

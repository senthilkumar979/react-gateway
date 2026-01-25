import type { RequestConfig } from '@/types/Scenarios.types'
import { FormLabel } from '@/ui/FormLabel'
import { RequestAccordionItem } from './RequestAccordionItem'

interface RequestConfigFormProps {
  isReadonly?: boolean
  request: RequestConfig
  onUpdate?: (updates: Partial<RequestConfig>) => void
  onRemove?: () => void
  index?: number
}

export const RequestConfigForm = ({
  isReadonly = false,
  request,
  onUpdate,
  onRemove,
  index = 0,
}: RequestConfigFormProps) => {
  const prefix = `request-${index}`
  const title = request.name.trim() || 'New Request'

  return (
    <RequestAccordionItem
      title={title}
      isActive={request.isActive}
      onActiveChange={(isActive) => onUpdate?.({ isActive })}
      onDelete={onRemove}
      defaultOpen={!isReadonly && !request.name.trim()}
      index={index}
      isReadonly={isReadonly}
    >
      <div className="mb-4">
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
          readOnly={isReadonly}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="e.g., Get User Profile"
        />
      </div>
      <div className="mb-4">
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
          readOnly={isReadonly}
          disabled={isReadonly}
          onChange={(e) => onUpdate({ url: e.target.value })}
          placeholder="e.g., /api/users/.*"
        />
      </div>
      <div className="row mb-4">
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
            readOnly={isReadonly}
            disabled={isReadonly}
            onChange={(e) => onUpdate?.({ statusCode: e.target.value })}
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
            readOnly={isReadonly}
            disabled={isReadonly}
            onChange={(e) =>
              onUpdate?.({ delayInMs: parseInt(e.target.value, 10) || 0 })
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
          readOnly={isReadonly}
          disabled={isReadonly}
          onChange={(e) => onUpdate?.({ customResponse: e.target.value })}
          placeholder='{"message": "Custom response"}'
        />
      </div>
    </RequestAccordionItem>
  )
}

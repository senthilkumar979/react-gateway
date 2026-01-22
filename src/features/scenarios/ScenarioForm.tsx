import { useState, useEffect } from 'react'
import type { Scenario, RequestConfig } from '@/types/scenarios.types'
import { RequestConfigForm } from './RequestConfigForm'
import { FormLabel } from '@/ui/FormLabel'

interface ScenarioFormProps {
  scenario: Scenario | null
  onSave: (scenario: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

export const ScenarioForm = ({ scenario, onSave, onCancel }: ScenarioFormProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [requests, setRequests] = useState<RequestConfig[]>([])

  useEffect(() => {
    if (scenario) {
      setName(scenario.name)
      setDescription(scenario.description)
      setRequests(scenario.requests)
    } else {
      setName('')
      setDescription('')
      setRequests([])
    }
  }, [scenario])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onSave({
      name: name.trim(),
      description: description.trim(),
      requests,
    })
  }

  const addRequest = () => {
    setRequests([
      ...requests,
      {
        name: '',
        isActive: true,
        url: '',
        statusCode: '200',
        customResponse: '{}',
        delayInMs: 0,
      },
    ])
  }

  const updateRequest = (index: number, updates: Partial<RequestConfig>) => {
    setRequests(requests.map((req, i) => (i === index ? { ...req, ...updates } : req)))
  }

  const removeRequest = (index: number) => {
    setRequests(requests.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <FormLabel htmlFor="scenario-name" required>
          Scenario Name
        </FormLabel>
        <input
          id="scenario-name"
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <FormLabel htmlFor="scenario-description" description="Optional description for this scenario">
          Description
        </FormLabel>
        <textarea
          id="scenario-description"
          className="form-control"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <FormLabel description="Configure API requests to intercept and manipulate">
            API Requests
          </FormLabel>
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={addRequest}>
            Add Request
          </button>
        </div>
        {requests.map((request, index) => (
          <RequestConfigForm
            key={index}
            index={index}
            request={request}
            onUpdate={(updates) => updateRequest(index, updates)}
            onRemove={() => removeRequest(index)}
          />
        ))}
        {requests.length === 0 && (
          <p className="text-muted small">No requests configured. Click "Add Request" to start.</p>
        )}
      </div>
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          {scenario ? 'Update' : 'Create'} Scenario
        </button>
        {scenario && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

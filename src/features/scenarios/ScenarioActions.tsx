import type { Scenario } from '@/types/Scenarios.types'
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { IconEdit } from '../../assets/IconEdit'
import { IconExport } from '../../assets/IconExport'
import { IconTrash } from '../../assets/IconTrash'
import { useScenarios } from '../../context/ScenariosContext'

export const ScenarioActions = ({
  scenario,
  onEdit,
}: {
  scenario: Scenario
  onEdit: (scenario: Scenario) => void
}) => {
  const { scenarios, deleteScenario } = useScenarios()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleExport = (scenarioId: string) => {
    const scenario = scenarios.find((s) => s.id === scenarioId)
    if (!scenario) return
    const dataStr = JSON.stringify(scenario, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${scenario.name}-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDeleteClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    deleteScenario(scenario.id)
    setShowDeleteModal(false)
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
  }

  return (
    <>
      <div className="d-flex gap-2 align-items-center">
        <Button
          variant="outline-info"
          size="sm"
          onClick={() => onEdit(scenario)}
        >
          <IconEdit width={16} height={16} />
        </Button>
        <Button variant="outline-danger" size="sm" onClick={handleDeleteClick}>
          <IconTrash width={16} height={16} />
        </Button>
        <Button
          type="button"
          variant="outline-secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            handleExport(scenario.id)
          }}
          title="Export Scenarios"
        >
          <IconExport />
        </Button>
      </div>

      {showDeleteModal && (
        <div
          className="modal fade show"
          tabIndex={-1}
          style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}
          role="dialog"
          onClick={handleCancelDelete}
        >
          <div
            className="modal-dialog"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Scenario</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCancelDelete}
                />
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete this scenario?
                  <br />
                  <strong>This action cannot be reverted.</strong>
                </p>
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={handleCancelDelete}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleConfirmDelete}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

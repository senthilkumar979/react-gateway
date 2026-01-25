import { IconChevronDown } from '@/assets/IconChevronDown'
import { IconTrash } from '@/assets/IconTrash'
import { useState, type ReactNode } from 'react'
import { Button } from 'react-bootstrap'
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput'
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel'

interface RequestAccordionItemProps {
  isReadonly?: boolean
  title: string
  children: ReactNode
  defaultOpen?: boolean
  isActive: boolean
  onActiveChange?: (isActive: boolean) => void
  onDelete?: () => void
  index?: number
}

export const RequestAccordionItem = ({
  title,
  children,
  defaultOpen = false,
  isActive,
  onActiveChange,
  onDelete,
  index = 0,
  isReadonly = false,
}: RequestAccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const uniqueId = `request-accordion-${index}`

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    onDelete?.()
    setShowDeleteModal(false)
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
  }

  const handleActiveToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    onActiveChange?.(e.target.checked)
  }

  return (
    <>
      <div className="request-accordion-item">
        <div
          className="request-accordion-header"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="d-flex align-items-center gap-3 flex-grow-1 justify-content-between">
            <div className="d-flex align-items-center gap-2">
            <IconChevronDown
              className={`request-accordion-icon ${isOpen ? 'open' : ''}`}
            />
              <div className="request-accordion-title">{title}</div>
            </div>
            <div className="d-flex align-items-center gap-2">
            <div className="form-check form-switch ms-auto" onClick={(e) => e.stopPropagation()}>
              <FormCheckInput
                id={`${uniqueId}-active`}
                checked={isActive}
                  disabled={isReadonly}
                  readOnly={isReadonly}
                onChange={handleActiveToggle}
                onClick={(e) => e.stopPropagation()}
              />
              <FormCheckLabel htmlFor={`${uniqueId}-active`} className="mb-0">
                {isActive ? 'Active' : 'Inactive'}
              </FormCheckLabel>
            </div>
            {!isReadonly && <Button
              variant="outline-danger"
              size="sm"
              onClick={handleDeleteClick}
              className="d-flex align-items-center"
            >
              <IconTrash width={16} height={16} />
              </Button>}
              </div>
          </div>
        </div>
        <div className={`request-accordion-content ${isOpen ? 'open' : ''}`}>
          <div className="request-accordion-body">{children}</div>
        </div>
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
                <h5 className="modal-title">Delete Request</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCancelDelete}
                />
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete this request?
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

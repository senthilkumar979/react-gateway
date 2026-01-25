import { type ReactNode } from 'react'

interface FormLabelProps {
  htmlFor?: string
  children: ReactNode
  required?: boolean
  icon?: ReactNode
  description?: string
  tooltip?: string
  className?: string
  isHideSpaceBelow?: boolean
}

export const FormLabel = ({
  htmlFor,
  children,
  required = false,
  icon,
  isHideSpaceBelow = false,
  description,
  className = '',
}: FormLabelProps) => {
  return (
    <div className={`${className} ${isHideSpaceBelow ? 'mb-0' : 'mb-2'}`}>
      <label
        htmlFor={htmlFor}
        className="form-label d-flex align-items-center gap-2 fw-semibold mb-1"
        style={{ fontSize: '0.875rem', color: '#495057' }}
      >
        {icon && <span className="text-primary">{icon}</span>}
        <div className={"d-flex justify-content-between align-items-center " + (required ? 'star' : '')}>{children}</div>
      </label>
      {description && (
        <small className="text-muted d-block" style={{ fontSize: '0.75rem', marginTop: '-0.25rem', textAlign: "left" }}>
          {description}
        </small>
      )}
    </div>
  )
}

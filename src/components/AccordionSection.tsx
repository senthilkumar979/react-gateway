import { IconChevronDown } from '@/assets/IconChevronDown'
import { useState, type ReactNode } from 'react'

interface AccordionSectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  description?: string
}

export const AccordionSection = ({ title, description, children, defaultOpen = false }: AccordionSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="accordion-item-modern">
      <button
        className="accordion-header-modern"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        data-open={isOpen}
      >
        <div className="accordion-title">{title}
          {description && <small className="text-muted text-white">{description}</small>}
        </div>
        <IconChevronDown className={`accordion-icon ${isOpen ? 'open' : ''}`} />
      </button>
      <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
        <div className="accordion-body-modern">{children}</div>
      </div>
    </div>
  )
}

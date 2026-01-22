import { useEffect, type ReactNode } from 'react'
import { useGateway } from '@/context/GatewayContext'

interface GatewayDrawerProps {
  children: ReactNode
}

export const GatewayDrawer = ({ children }: GatewayDrawerProps) => {
  const { state, setIsOpen } = useGateway()

  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [state.isOpen])

  return (
    <>
      <div
        className={`offcanvas offcanvas-${state.drawerPosition === 'left' ? 'start' : 'end'} ${state.isOpen ? 'show' : ''}`}
        style={{ visibility: state.isOpen ? 'visible' : 'hidden' }}
        tabIndex={-1}
        aria-labelledby="gateway-drawer-label"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="gateway-drawer-label">
            React Gateway Dev Tools
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body">{children}</div>
      </div>
      {state.isOpen && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={() => setIsOpen(false)}
          style={{ zIndex: 1040 }}
        />
      )}
    </>
  )
}

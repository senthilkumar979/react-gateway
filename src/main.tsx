import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { GatewayErrorBoundary } from './features/errorBoundary/GatewayErrorBoundary'
import './index.css'
import { ReactGateway } from './ReactGateway.tsx'
import { GenericError } from './GenericError.tsx'
import { ErrorBoundary } from 'react-error-boundary'
import { CostlyComponent } from './CostlyComponent.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={GenericError}>
      <ReactGateway
        components={['App']}
        onSnapshotChange={(snapshot) => {
          console.log('Snapshot changed:', snapshot)
        }}
        clientApp={<App />}
        fallbackComponent={GenericError}
        costAnalyzerComponent={CostlyComponent}
      />
    </ErrorBoundary>
  </StrictMode>,
)

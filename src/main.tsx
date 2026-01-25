import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import App from './App.tsx'
import { GenericError } from './GenericError.tsx'
import './index.css'
import { ReactGateway } from './ReactGateway.tsx'
import { CostlyComponent } from './CostlyComponent.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={GenericError}>
      <ReactGateway
        components={['App']}
        scenarioComponent={() => <CostlyComponent />}
        onSnapshotChange={(snapshot) => {
          console.log('Snapshot changed:', snapshot)
        }}
        clientApp={<App />}
        fallbackComponent={GenericError}
      />
    </ErrorBoundary>
  </StrictMode>,
)

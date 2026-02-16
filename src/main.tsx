import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import App from './App.tsx'
import errorFlow from './data/errorFlow.json'
import happyFlow from './data/happyFlow.json'
import { GenericError } from './GenericError.tsx'
import './index.css'
import { ReactGateway } from './ReactGateway.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={GenericError}>
      <ReactGateway
        responseList={[
          { 'Save Collateral Error': errorFlow },
          { 'Update Proposal Success': happyFlow },
        ]}
        clientApp={<App />}
        onSnapshotChange={(snapshot) => {
          console.log('Snapshot changed:', snapshot)
        }}
        snapshots={[
          {
            id: '1',
            name: 'Snapshot 1',
          },
          {
            id: '2',
            name: 'Snapshot 2',
          },
        ]}
      />
    </ErrorBoundary>
  </StrictMode>,
)

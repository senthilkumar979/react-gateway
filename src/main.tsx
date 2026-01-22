import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { GatewayErrorBoundary } from './features/errorBoundary/GatewayErrorBoundary'
import './index.css'
import { ReactGateway } from './ReactGateway.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GatewayErrorBoundary>
      <ReactGateway
        components={['App']}
        onSnapshotChange={(snapshot) => {
          console.log('Snapshot changed:', snapshot)
        }}
        clientApp={<App />}
      />
    </GatewayErrorBoundary>
  </StrictMode>,
)

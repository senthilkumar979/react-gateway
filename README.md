# React Gateway

A comprehensive development tool library for React applications that provides debugging, testing, and monitoring capabilities through an offcanvas/drawer interface.

## Features

### 1. Scenarios - API Request Interception
- Intercept and manipulate outgoing API requests
- Create custom scenarios (e.g., Onboarding, Payment Failure)
- Configure multiple request interceptors per scenario
- Customize response status codes, body, and delays
- Export/import scenarios as JSON

### 2. Snapshots - Storage Management
- Capture and restore localStorage, sessionStorage, and cookies
- Create named snapshots for different application states
- Restore snapshots on demand via callback

### 3. General Settings
- Configure drawer and trigger button positions (left/right)
- Freeze time and date to specific values
- Offset time by +/- days
- Chaos testing mode with error throwing

### 4. Render Cost Analyzer
- Track component render counts and durations
- Identify render triggers (props, context changes)
- Generate detailed performance reports
- Display badges near components showing render metrics

### 5. Record UI Flows and Replay
- Record user interactions (clicks, inputs)
- Save recorded flows with custom names
- Replay flows to automate testing
- Export/import flows as JSON

### 6. Custom Error Boundary
- Catch and display React errors with detailed information
- Show component stack traces
- Provide error recovery options

### 7. Persona-Based Component Comparison
- Render components side-by-side for different scenarios
- Compare up to 3 scenarios simultaneously
- Isolate state for each scenario

## Installation

```bash
npm install react-gateway
```

## Basic Usage

```tsx
import { ReactGateway } from 'react-gateway'
import 'react-gateway/styles'

function App() {
  return (
    <>
      <YourApp />
      <ReactGateway
        components={['CheckoutSummary', 'ProductList']}
        onSnapshotChange={(snapshot) => {
          console.log('Snapshot changed:', snapshot)
        }}
      />
    </>
  )
}
```

## Advanced Usage

### With Render Tracking

```tsx
import { useRenderTracking } from 'react-gateway'

function MyComponent({ filters }) {
  useRenderTracking({
    componentName: 'MyComponent',
    props: { filters },
  })

  return <div>...</div>
}
```

### With Error Boundary

```tsx
import { GatewayErrorBoundary, ChaosBoundary } from 'react-gateway'

function App() {
  return (
    <GatewayErrorBoundary>
      <ChaosBoundary>
        <YourApp />
      </ChaosBoundary>
    </GatewayErrorBoundary>
  )
}
```

### With Persona Comparison

```tsx
import { ReactGateway } from 'react-gateway'

function App() {
  return (
    <ReactGateway
      scenarioComponent={CheckoutPage}
      position="right"
      triggerPosition="right"
    />
  )
}
```

## API Reference

### ReactGateway Props

| Prop | Type | Description |
|------|------|-------------|
| `components` | `string[]` | Component names to track for render analysis |
| `onSnapshotChange` | `(snapshot: Snapshot) => void` | Callback when snapshot is selected |
| `scenarioComponent` | `React.ComponentType` | Component to render in persona comparison |
| `position` | `'left' \| 'right'` | Drawer position (default: 'right') |
| `triggerPosition` | `'left' \| 'right'` | Trigger button position (default: 'right') |

### Hooks

#### `useRenderTracking(options)`

Track component renders for performance analysis.

```tsx
useRenderTracking({
  componentName: 'MyComponent',
  props: { filters, sortBy },
  contextValues: { userContext, themeContext },
})
```

### Components

#### `GatewayErrorBoundary`

Catches React errors and displays them with details.

```tsx
<GatewayErrorBoundary fallback={(error, errorInfo) => <CustomError />}>
  <YourApp />
</GatewayErrorBoundary>
```

#### `ChaosBoundary`

Throws errors when chaos mode is enabled in settings.

```tsx
<ChaosBoundary>
  <YourComponent />
</ChaosBoundary>
```

## Data Persistence

All user-created data (scenarios, snapshots, settings, UI flows) is automatically persisted to localStorage and survives page reloads.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

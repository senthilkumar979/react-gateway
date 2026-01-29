import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import './App.css'
import { GatewayErrorBoundary } from './features/errorBoundary/GatewayErrorBoundary'

function App() {
  const [count, setCount] = useState(0)

  const fetchCountries = async () => {
    const response = await fetch('https://restcountries.com/v3.1/name/eesti')
    const data = await response.json()
    console.log(data)
  }

  useEffect(() => {
    fetchCountries()
  }, [])

  return (
    <GatewayErrorBoundary>
      <h1>React Gateway</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Button onClick={fetchCountries}>Fetch Countries</Button>
    </GatewayErrorBoundary>
  )
}

export default App

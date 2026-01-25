import { useState } from 'react'

// Simulate expensive computation
function expensiveCalculation(num: number): number {
  let result = 0
  for (let i = 0; i < 1_000_000_0; i++) {
    result += Math.sin(i + num)
  }
  return result
}

export const CostlyComponent = () => {
  const [count, setCount] = useState(0)
  const [input, setInput] = useState('')

  // No memoization: expensive calculation runs on every render
  const computedValue = expensiveCalculation(count)

  // Handler to force an unnecessary parent re-render
  function forceRerender() {
    setInput((input) => input + '.')
  }

  return (
    <div>
      <h4>CostlyComponent</h4>
      <div>
        <button
          onClick={() => setCount((c) => c + 1)}
          style={{ marginRight: 12 }}
        >
          Increment Count ({count})
        </button>
        <button onClick={forceRerender}>Force Unrelated Rerender</button>
      </div>
      <div style={{ marginTop: 20 }}>
        <strong>Expensive Computed Value:</strong>{' '}
        <span>{computedValue.toFixed(2)}</span>
      </div>
      <div style={{ marginTop: 20 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type anything (causes rerender)"
        />
      </div>
    </div>
  )
}

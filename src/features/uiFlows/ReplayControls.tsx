import { useState } from 'react'
import type { UIFlow } from '@/types/uiFlows.types'

interface ReplayControlsProps {
  flow: UIFlow
  isReplaying: boolean
  onReplayStart: () => void
  onReplayEnd: () => void
}

export const ReplayControls = ({
  flow,
  isReplaying,
  onReplayStart,
  onReplayEnd,
}: ReplayControlsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const replayFlow = async () => {
    onReplayStart()
    setCurrentIndex(0)

    for (let i = 0; i < flow.events.length; i++) {
      const event = flow.events[i]
      const element = document.querySelector(event.selector)

      if (!element) {
        console.warn(`Element not found for selector: ${event.selector}`)
        continue
      }

      if (event.type === 'click') {
        ;(element as HTMLElement).click()
      } else if (event.type === 'input') {
        const input = element as HTMLInputElement | HTMLTextAreaElement
        input.value = event.value || ''
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
      }

      setCurrentIndex(i + 1)

      if (i < flow.events.length - 1) {
        const delay = flow.events[i + 1].timestamp - event.timestamp
        await new Promise((resolve) => setTimeout(resolve, Math.min(delay, 1000)))
      }
    }

    onReplayEnd()
  }

  return (
    <div className="d-flex align-items-center gap-2">
      {!isReplaying ? (
        <button className="btn btn-sm btn-primary" onClick={replayFlow}>
          Replay
        </button>
      ) : (
        <span className="badge bg-primary">
          Replaying {currentIndex}/{flow.events.length}
        </span>
      )}
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { getElementSelector } from '@/utils/selectorUtils'
import type { UIEvent } from '@/types/uiFlows.types'

interface UseUIRecorderReturn {
  isRecording: boolean
  events: UIEvent[]
  startRecording: () => void
  stopRecording: () => void
  pauseRecording: () => void
  resumeRecording: () => void
  clearEvents: () => void
}

export const useUIRecorder = (): UseUIRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [events, setEvents] = useState<UIEvent[]>([])

  const recordEvent = useCallback(
    (type: 'click' | 'input', element: Element, value?: string) => {
      if (!isRecording || isPaused) return

      const selector = getElementSelector(element)
      const event: UIEvent = {
        type,
        selector,
        value,
        timestamp: Date.now(),
      }

      setEvents((prev) => [...prev, event])
    },
    [isRecording, isPaused]
  )

  useEffect(() => {
    if (!isRecording) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element
      if (target) {
        recordEvent('click', target)
      }
    }

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        recordEvent('input', target, target.value)
      }
    }

    document.addEventListener('click', handleClick, true)
    document.addEventListener('change', handleInput, true)
    document.addEventListener('input', handleInput, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('change', handleInput, true)
      document.removeEventListener('input', handleInput, true)
    }
  }, [isRecording, recordEvent])

  const startRecording = () => {
    setEvents([])
    setIsRecording(true)
    setIsPaused(false)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
  }

  const pauseRecording = () => {
    setIsPaused(true)
  }

  const resumeRecording = () => {
    setIsPaused(false)
  }

  const clearEvents = () => {
    setEvents([])
  }

  return {
    isRecording,
    events,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearEvents,
  }
}

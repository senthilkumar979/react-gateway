import { useEffect, useRef } from 'react'
import { useRenderAnalyzer } from '@/context/RenderAnalyzerContext'

interface UseRenderTrackingOptions {
  componentName: string
  props?: Record<string, unknown>
  contextValues?: Record<string, unknown>
}

export const useRenderTracking = ({
  componentName,
  props,
  contextValues,
}: UseRenderTrackingOptions) => {
  const { isAnalyzing, addReport } = useRenderAnalyzer()
  const renderCountRef = useRef(0)
  const prevPropsRef = useRef(props)
  const prevContextRef = useRef(contextValues)
  const durationsRef = useRef<number[]>([])

  useEffect(() => {
    if (!isAnalyzing) return

    renderCountRef.current += 1
    const startTime = performance.now()

    return () => {
      const duration = performance.now() - startTime
      durationsRef.current.push(duration)
    }
  })

  useEffect(() => {
    if (!isAnalyzing) return

    const triggers: string[] = []

    if (props && prevPropsRef.current) {
      Object.keys(props).forEach((key) => {
        if (props[key] !== prevPropsRef.current?.[key]) {
          triggers.push(`prop ${key} (new reference)`)
        }
      })
    }

    if (contextValues && prevContextRef.current) {
      Object.keys(contextValues).forEach((key) => {
        if (contextValues[key] !== prevContextRef.current?.[key]) {
          triggers.push(`context ${key}`)
        }
      })
    }

    if (triggers.length > 0 || renderCountRef.current === 1) {
      const averageDuration =
        durationsRef.current.length > 0
          ? durationsRef.current.reduce((a, b) => a + b, 0) / durationsRef.current.length
          : 0

      addReport({
        componentName,
        renderCount: renderCountRef.current,
        averageDuration,
        triggers: triggers.length > 0 ? triggers : ['initial render'],
      })
    }

    prevPropsRef.current = props
    prevContextRef.current = contextValues
  }, [isAnalyzing, componentName, props, contextValues, addReport])
}

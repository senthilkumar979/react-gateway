import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'

export interface RenderTrigger {
  type: 'prop' | 'state' | 'context' | 'parent' | 'hook' | 'initial'
  name: string
  previousValue?: unknown
  newValue?: unknown
  timestamp: number
}

export interface ComponentRender {
  componentName: string
  duration: number
  timestamp: number
  triggers: RenderTrigger[]
  props?: Record<string, unknown>
  phase: 'mount' | 'update'
}

export interface RenderReport {
  componentName: string
  renderCount: number
  totalDuration: number
  averageDuration: number
  minDuration: number
  maxDuration: number
  renders: ComponentRender[]
  triggers: string[]
  mostCommonTriggers: Array<{ trigger: string; count: number }>
}

interface RenderAnalyzerContextValue {
  isAnalyzing: boolean
  reports: RenderReport[]
  startAnalyzing: () => void
  stopAnalyzing: () => void
  addRender: (render: ComponentRender) => void
  clearReports: () => void
}

const RenderAnalyzerContext = createContext<RenderAnalyzerContextValue | undefined>(undefined)

export const RenderAnalyzerProvider = ({ children }: { children: ReactNode }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [reports, setReports] = useState<RenderReport[]>([])
  const pendingRendersRef = useRef<ComponentRender[]>([])
  const updateScheduledRef = useRef(false)
  const isUpdatingRef = useRef(false)

  const startAnalyzing = () => {
    setIsAnalyzing(true)
    setReports([])
    pendingRendersRef.current = []
    updateScheduledRef.current = false
  }

  const stopAnalyzing = () => {
    setIsAnalyzing(false)
    pendingRendersRef.current = []
    updateScheduledRef.current = false
  }

  // Process pending renders using useEffect with interval to avoid blocking
  useEffect(() => {
    if (!isAnalyzing) return

    const processRenders = () => {
      if (isUpdatingRef.current || pendingRendersRef.current.length === 0) {
        return
      }

      isUpdatingRef.current = true
      const rendersToProcess = [...pendingRendersRef.current]
      pendingRendersRef.current = []
      updateScheduledRef.current = false

      setReports((prev) => {
        let updated = [...prev]

        rendersToProcess.forEach((render) => {
          const existing = updated.find((r) => r.componentName === render.componentName)

          // Convert triggers to strings for summary
          const triggerToString = (t: RenderTrigger): string => {
            if (t.type === 'prop') return `prop: ${t.name}`
            if (t.type === 'state') return `state: ${t.name}`
            if (t.type === 'context') return `context: ${t.name}`
            if (t.type === 'parent') return 'parent re-render'
            if (t.type === 'hook') return `hook: ${t.name}`
            return 'initial render'
          }

          if (existing) {
            // Limit to last 100 renders per component to prevent memory issues
            const updatedRenders = [...existing.renders, render].slice(-100)
            const totalDuration = updatedRenders.reduce((sum, r) => sum + r.duration, 0)
            const durations = updatedRenders.map((r) => r.duration)
            const allTriggers = updatedRenders.flatMap((r) =>
              r.triggers.map(triggerToString)
            )

            const triggerCounts = allTriggers.reduce((acc, trigger) => {
              acc[trigger] = (acc[trigger] || 0) + 1
              return acc
            }, {} as Record<string, number>)

            const mostCommonTriggers = Object.entries(triggerCounts)
              .map(([trigger, count]) => ({ trigger, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5)

            updated = updated.map((r) =>
              r.componentName === render.componentName
                ? {
                    componentName: r.componentName,
                    renderCount: updatedRenders.length,
                    totalDuration,
                    averageDuration: totalDuration / updatedRenders.length,
                    minDuration: Math.min(...durations),
                    maxDuration: Math.max(...durations),
                    renders: updatedRenders,
                    triggers: Array.from(new Set(allTriggers)),
                    mostCommonTriggers,
                  }
                : r
            )
          } else {
            const triggerStrings = render.triggers.map(triggerToString)
            updated.push({
              componentName: render.componentName,
              renderCount: 1,
              totalDuration: render.duration,
              averageDuration: render.duration,
              minDuration: render.duration,
              maxDuration: render.duration,
              renders: [render],
              triggers: Array.from(new Set(triggerStrings)),
              mostCommonTriggers: triggerStrings.map((t) => ({ trigger: t, count: 1 })),
            })
          }
        })

        return updated
      })

      // Reset flag after a short delay to allow state update to complete
      setTimeout(() => {
        isUpdatingRef.current = false
      }, 50)
    }

    // Process renders every 500ms to avoid blocking the UI
    const intervalId = setInterval(() => {
      if (updateScheduledRef.current && !isUpdatingRef.current) {
        processRenders()
      }
    }, 500)

    return () => {
      clearInterval(intervalId)
    }
  }, [isAnalyzing])

  const addRender = useCallback(
    (render: ComponentRender) => {
      if (!isAnalyzing) return

      // Skip tracking gateway components to prevent infinite loops
      if (
        render.componentName.includes('Gateway') ||
        render.componentName.includes('RenderProfiler') ||
        render.componentName.includes('RenderAnalyzer') ||
        render.componentName.includes('ReportView') ||
        render.componentName.includes('AnalyzerControls')
      ) {
        return
      }

      // Limit the number of pending renders to prevent memory issues
      if (pendingRendersRef.current.length > 1000) {
        return
      }

      pendingRendersRef.current.push(render)

      if (!updateScheduledRef.current) {
        updateScheduledRef.current = true
      }
    },
    [isAnalyzing]
  )

  const clearReports = () => {
    setReports([])
  }

  return (
    <RenderAnalyzerContext.Provider
      value={{
        isAnalyzing,
        reports,
        startAnalyzing,
        stopAnalyzing,
        addRender,
        clearReports,
      }}
    >
      {children}
    </RenderAnalyzerContext.Provider>
  )
}

export const useRenderAnalyzer = (): RenderAnalyzerContextValue => {
  const context = useContext(RenderAnalyzerContext)
  if (!context) {
    throw new Error('useRenderAnalyzer must be used within RenderAnalyzerProvider')
  }
  return context
}

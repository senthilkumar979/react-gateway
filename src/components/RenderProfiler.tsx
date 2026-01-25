import {
  Profiler,
  ProfilerOnRenderCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { useRenderAnalyzer } from '@/context/RenderAnalyzerContext'
import type { ComponentRender, RenderTrigger } from '@/context/RenderAnalyzerContext'

interface RenderProfilerProps {
  children: ReactNode
}

// Store component render history for comparison
const componentHistory = new Map<
  string,
  {
    renderCount: number
    lastRenderTime: number
    lastDuration: number
    lastPhase: 'mount' | 'update'
  }
>()

// Track parent-child relationships
const componentTree = new Map<string, string[]>()

export const RenderProfiler = ({ children }: RenderProfilerProps) => {
  const { isAnalyzing, addRender } = useRenderAnalyzer()
  const renderStackRef = useRef<string[]>([])
  const isProcessingRef = useRef(false)

  useEffect(() => {
    if (!isAnalyzing) {
      componentHistory.clear()
      componentTree.clear()
      renderStackRef.current = []
      isProcessingRef.current = false
    }
  }, [isAnalyzing])

  const onRenderCallback: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
  ) => {
    if (!isAnalyzing || isProcessingRef.current) return

    // Skip if this is a commit phase (we only want to track during actual render)
    if (commitTime - startTime < 0) return

    const componentName = id === 'Root' ? 'App' : id
    const isMount = phase === 'mount'
    const isUpdate = phase === 'update'

    const history = componentHistory.get(componentName) || {
      renderCount: 0,
      lastRenderTime: 0,
      lastDuration: 0,
      lastPhase: 'mount' as const,
    }

    history.renderCount += 1

    // Detect what caused the render
    const triggers: RenderTrigger[] = []

    if (isMount) {
      triggers.push({
        type: 'initial',
        name: 'component mounted',
        timestamp: startTime,
      })
    } else if (isUpdate) {
      const timeSinceLastRender = startTime - history.lastRenderTime
      const durationChange = Math.abs(actualDuration - history.lastDuration)
      const durationRatio = history.lastDuration > 0 ? actualDuration / history.lastDuration : 1

      // Multiple heuristics to detect render cause
      if (timeSinceLastRender < 50 && durationChange < actualDuration * 0.3) {
        // Very quick re-render with similar duration = likely parent re-render
        triggers.push({
          type: 'parent',
          name: 'parent component re-rendered',
          timestamp: startTime,
        })
      } else if (actualDuration > baseDuration * 2) {
        // Much longer than base = significant work, likely props/state change
        triggers.push({
          type: 'prop',
          name: 'props or state changed',
          timestamp: startTime,
        })
      } else if (durationRatio > 1.5) {
        // Duration increased significantly = state change
        triggers.push({
          type: 'state',
          name: 'state change detected',
          timestamp: startTime,
        })
      } else if (baseDuration < 0.1) {
        // Very small base duration = likely just passing props
        triggers.push({
          type: 'parent',
          name: 'parent re-render (prop pass-through)',
          timestamp: startTime,
        })
      } else {
        // Generic update
        triggers.push({
          type: 'parent',
          name: 'component update',
          timestamp: startTime,
        })
      }

      // Additional analysis
      if (actualDuration > 16) {
        // Longer than one frame = expensive render
        triggers.push({
          type: 'state',
          name: 'expensive render (>16ms)',
          timestamp: startTime,
        })
      }
    }

    // Update history
    history.lastRenderTime = startTime
    history.lastDuration = actualDuration
    history.lastPhase = isMount ? 'mount' : 'update'
    componentHistory.set(componentName, history)

    const render: ComponentRender = {
      componentName,
      duration: actualDuration,
      timestamp: startTime,
      triggers,
      phase: isMount ? 'mount' : 'update',
    }

    // Add render directly - it will be batched by the context
    addRender(render)
  }

  if (!isAnalyzing) {
    return <>{children}</>
  }

  return (
    <Profiler id="Root" onRender={onRenderCallback}>
      {children}
    </Profiler>
  )
}

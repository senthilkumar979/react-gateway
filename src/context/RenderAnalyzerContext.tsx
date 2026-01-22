import { createContext, useContext, useState, type ReactNode } from 'react'

interface RenderReport {
  componentName: string
  renderCount: number
  averageDuration: number
  triggers: string[]
}

interface RenderAnalyzerContextValue {
  isAnalyzing: boolean
  reports: RenderReport[]
  startAnalyzing: () => void
  stopAnalyzing: () => void
  addReport: (report: RenderReport) => void
  clearReports: () => void
}

const RenderAnalyzerContext = createContext<RenderAnalyzerContextValue | undefined>(undefined)

export const RenderAnalyzerProvider = ({ children }: { children: ReactNode }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [reports, setReports] = useState<RenderReport[]>([])

  const startAnalyzing = () => {
    setIsAnalyzing(true)
    setReports([])
  }

  const stopAnalyzing = () => {
    setIsAnalyzing(false)
  }

  const addReport = (report: RenderReport) => {
    setReports((prev) => {
      const existing = prev.find((r) => r.componentName === report.componentName)
      if (existing) {
        return prev.map((r) =>
          r.componentName === report.componentName ? report : r
        )
      }
      return [...prev, report]
    })
  }

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
        addReport,
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

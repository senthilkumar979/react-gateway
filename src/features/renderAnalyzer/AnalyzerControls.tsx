import { useRenderAnalyzer } from '@/context/RenderAnalyzerContext'

export const AnalyzerControls = () => {
  const { isAnalyzing, startAnalyzing, stopAnalyzing, clearReports } = useRenderAnalyzer()

  return (
    <div className="d-flex gap-2">
      {!isAnalyzing ? (
        <button className="btn btn-primary btn-sm" onClick={startAnalyzing}>
          Start Analyzer
        </button>
      ) : (
        <button className="btn btn-danger btn-sm" onClick={stopAnalyzing}>
          Stop Analyzer
        </button>
      )}
      <button className="btn btn-outline-secondary btn-sm" onClick={clearReports}>
        Clear Reports
      </button>
    </div>
  )
}

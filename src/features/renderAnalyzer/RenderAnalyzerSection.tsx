import { AccordionSection } from '@/components/AccordionSection'
import { useRenderAnalyzer } from '@/context/RenderAnalyzerContext'
import { AnalyzerControls } from './AnalyzerControls'
import { ReportView } from './ReportView'

export const RenderAnalyzerSection = () => {
  const { reports } = useRenderAnalyzer()

  return (
    <AccordionSection title="Render Cost Analyzer">
      <AnalyzerControls />
      <div className="mt-3">
        <ReportView reports={reports} />
      </div>
    </AccordionSection>
  )
}

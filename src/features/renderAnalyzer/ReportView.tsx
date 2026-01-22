interface RenderReport {
  componentName: string
  renderCount: number
  averageDuration: number
  triggers: string[]
}

interface ReportViewProps {
  reports: RenderReport[]
}

export const ReportView = ({ reports }: ReportViewProps) => {
  if (reports.length === 0) {
    return <p className="text-muted small">No render data yet. Start the analyzer to begin tracking.</p>
  }

  return (
    <div>
      <h6>Render Reports</h6>
      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Component</th>
              <th>Renders</th>
              <th>Avg Duration</th>
              <th>Triggers</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.componentName}>
                <td>
                  <strong>{report.componentName}</strong>
                </td>
                <td>
                  <span className="badge bg-secondary">🔁 {report.renderCount}x</span>
                </td>
                <td>
                  <span className="badge bg-info">{report.averageDuration.toFixed(2)}ms</span>
                </td>
                <td>
                  <ul className="list-unstyled mb-0 small">
                    {report.triggers.map((trigger, idx) => (
                      <li key={idx}>• {trigger}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

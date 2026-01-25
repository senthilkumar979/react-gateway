import { Fragment, useState } from 'react'
import type { RenderReport } from '@/context/RenderAnalyzerContext'

interface ReportViewProps {
  reports: RenderReport[]
}

export const ReportView = ({ reports }: ReportViewProps) => {
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null)

  if (reports.length === 0) {
    return (
      <p className="text-muted small">
        No render data yet. Start the analyzer to begin tracking.
      </p>
    )
  }

  const sortedReports = [...reports].sort((a, b) => b.renderCount - a.renderCount)

  return (
    <div>
      <h6>Render Analysis Report</h6>
      <div className="table-responsive">
        <table className="table table-sm table-hover">
          <thead>
            <tr>
              <th>Component</th>
              <th>Renders</th>
              <th>Avg Duration</th>
              <th>Min/Max</th>
              <th>Total Time</th>
              <th>Common Triggers</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {sortedReports.map((report) => (
              <Fragment key={report.componentName}>
                <tr>
                  <td>
                    <strong>{report.componentName}</strong>
                  </td>
                  <td>
                    <span className="badge bg-secondary">🔁 {report.renderCount}x</span>
                  </td>
                  <td>
                    <span className="badge bg-info">
                      {report.averageDuration.toFixed(2)}ms
                    </span>
                  </td>
                  <td>
                    <small className="text-muted">
                      {report.minDuration.toFixed(2)}ms / {report.maxDuration.toFixed(2)}ms
                    </small>
                  </td>
                  <td>
                    <span className="badge bg-warning text-dark">
                      {report.totalDuration.toFixed(2)}ms
                    </span>
                  </td>
                  <td>
                    <div className="small">
                      {report.mostCommonTriggers.slice(0, 3).map((trigger, idx) => (
                        <span
                          key={idx}
                          className="badge bg-light text-dark me-1 mb-1"
                          style={{ fontSize: '0.75rem' }}
                        >
                          {trigger.trigger} ({trigger.count}x)
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        setExpandedComponent(
                          expandedComponent === report.componentName
                            ? null
                            : report.componentName
                        )
                      }
                    >
                      {expandedComponent === report.componentName ? 'Hide' : 'Show'}
                    </button>
                  </td>
                </tr>
                {expandedComponent === report.componentName && (
                  <tr>
                    <td colSpan={7}>
                      <div className="p-3 bg-light rounded">
                        <h6 className="mb-3">Detailed Render History</h6>
                        <div className="table-responsive">
                          <table className="table table-sm table-bordered">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Phase</th>
                                <th>Duration</th>
                                <th>Timestamp</th>
                                <th>Triggers</th>
                              </tr>
                            </thead>
                            <tbody>
                              {report.renders.map((render, idx) => (
                                <tr key={idx}>
                                  <td>{idx + 1}</td>
                                  <td>
                                    <span
                                      className={`badge ${
                                        render.phase === 'mount'
                                          ? 'bg-success'
                                          : 'bg-primary'
                                      }`}
                                    >
                                      {render.phase}
                                    </span>
                                  </td>
                                  <td>{render.duration.toFixed(2)}ms</td>
                                  <td>
                                    <small>
                                      {new Date(render.timestamp).toLocaleTimeString()}
                                    </small>
                                  </td>
                                  <td>
                                    <ul className="list-unstyled mb-0 small">
                                      {render.triggers.map((trigger, tIdx) => (
                                        <li key={tIdx}>
                                          <span className="badge bg-secondary me-1">
                                            {trigger.type}
                                          </span>
                                          {trigger.name}
                                        </li>
                                      ))}
                                    </ul>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-3">
                          <h6>All Triggers</h6>
                          <div className="d-flex flex-wrap gap-1">
                            {report.triggers.map((trigger, idx) => (
                              <span
                                key={idx}
                                className="badge bg-light text-dark"
                                style={{ fontSize: '0.75rem' }}
                              >
                                {trigger}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

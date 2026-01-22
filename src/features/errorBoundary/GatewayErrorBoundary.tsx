import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: (error: Error, errorInfo: React.ErrorInfo) => ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class GatewayErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })
    console.error('GatewayErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.state.errorInfo!)
      }

      return (
        <div className="alert alert-danger m-3" role="alert">
          <h4 className="alert-heading">Something went wrong</h4>
          <p className="mb-2">
            <strong>Error:</strong> {this.state.error.message}
          </p>
          {this.state.errorInfo && (
            <details className="mt-2">
              <summary>Component Stack</summary>
              <pre className="mt-2 small" style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button
            className="btn btn-sm btn-outline-danger mt-2"
            onClick={() => {
              this.setState({
                hasError: false,
                error: null,
                errorInfo: null,
              })
            }}
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

import type { FallbackProps } from 'react-error-boundary'

export const GenericError = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(90deg, #f7f8fa 0%, #e9edef 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0',
      }}
    >
      <div
        style={{
          background: '#fff',
          border: '1px solid #EAEDF1',
          borderRadius: 10,
          padding: '2.5rem 2.5rem 2rem 2.5rem',
          boxShadow: '0 10px 40px 0 rgba(15, 31, 61, 0.08)',
          maxWidth: 460,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <svg
          width="72"
          height="72"
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginBottom: 24 }}
          aria-hidden="true"
        >
          <circle cx="256" cy="256" r="256" fill="#F7EDED" />
          <path
            d="M320 176L192 336"
            stroke="#DB2A2A"
            strokeWidth="28"
            strokeLinecap="round"
          />
          <path
            d="M192 176L320 336"
            stroke="#DB2A2A"
            strokeWidth="28"
            strokeLinecap="round"
          />
        </svg>
        <h1
          style={{
            fontSize: '2.1rem',
            color: '#212529',
            marginBottom: 14,
            fontWeight: 600,
            letterSpacing: '-1px',
          }}
        >
          Unexpected Error Occurred
        </h1>
        <p
          style={{
            color: '#525a6a',
            fontSize: '1.08rem',
            margin: '0 0 1.5rem 0',
          }}
        >
          Unfortunately, something went wrong on our end. Please try the
          following action or reach out for assistance.
        </p>

        {error instanceof Error && (
          <details
            style={{
              background: '#FBF9F9',
              border: '1px solid #F1EBEB',
              borderRadius: 6,
              marginBottom: 22,
              padding: '0.9rem 1rem',
              wordBreak: 'break-word',
              color: '#b71c1c',
              fontFamily: 'Menlo, Monaco, Consolas, monospace',
              fontSize: '0.97rem',
              textAlign: 'left',
              cursor: 'pointer',
              whiteSpace: 'pre-line',
            }}
            open
          >
            <summary
              style={{
                fontWeight: 500,
                marginBottom: '0.35rem',
                color: '#812020',
                cursor: 'pointer',
              }}
            >
              Error Details
            </summary>
            <div>{error.message}</div>
          </details>
        )}

        <button
          className="btn btn-outline-primary"
          style={{
            marginTop: 4,
            fontWeight: 500,
            borderRadius: '6px',
            padding: '0.55rem 2.2rem',
            fontSize: '1.07rem',
            border: '2px solid #6187FF',
            color: '#2460E6',
            background: '#fff',
            boxShadow: '0 2px 8px #6187ff19',
            transition: 'background 0.18s, color 0.18s',
            cursor: 'pointer',
          }}
          onClick={resetErrorBoundary}
        >
          Reload Page
        </button>
        <div
          style={{
            color: '#657187',
            fontSize: '0.98rem',
            marginTop: 30,
            borderTop: '1px solid #EAEDF4',
            paddingTop: 20,
            lineHeight: 1.6,
          }}
        >
          If this issue continues, please contact our support team at{' '}
          <a
            href="mailto:support@example.com"
            style={{
              color: '#2045bb',
              fontWeight: 500,
              textDecoration: 'underline',
              wordBreak: 'break-all',
            }}
          >
            support@example.com
          </a>
          .
        </div>
      </div>
    </div>
  )
}

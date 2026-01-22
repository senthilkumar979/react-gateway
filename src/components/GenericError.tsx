import type { FallbackProps } from 'react-error-boundary'

export const GenericError = ({ error }: FallbackProps) => {
  return (
    <div>
      <h1>Error</h1>
      {error instanceof Error && <p>{error.message}</p>}
    </div>
  )
}

interface RecordingControlsProps {
  isRecording: boolean
  onStart: () => void
  onStop: () => void
  eventsCount: number
}

export const RecordingControls = ({
  isRecording,
  onStart,
  onStop,
  eventsCount,
}: RecordingControlsProps) => {
  return (
    <div>
      <div className="d-flex gap-2 align-items-center">
        {!isRecording ? (
          <button className="btn btn-danger btn-sm" onClick={onStart}>
            Start Recording
          </button>
        ) : (
          <button className="btn btn-danger btn-sm" onClick={onStop}>
            Stop Recording
          </button>
        )}
        {isRecording && (
          <span className="badge bg-danger">
            <span className="spinner-border spinner-border-sm me-1" role="status" />
            Recording...
          </span>
        )}
        {eventsCount > 0 && (
          <span className="text-muted small">Events captured: {eventsCount}</span>
        )}
      </div>
    </div>
  )
}

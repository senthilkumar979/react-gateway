import { useRef } from 'react'
import type { UIFlow } from '@/types/UiFlows.types'

interface ImportExportButtonsProps {
  flows: UIFlow[]
  onImport: (flows: UIFlow[]) => void
}

export const ImportExportButtons = ({
  flows,
  onImport,
}: ImportExportButtonsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const dataStr = JSON.stringify(flows, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ui-flows-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const imported = JSON.parse(content) as UIFlow[]
        onImport(imported)
      } catch (error) {
        alert('Invalid JSON file. Please check the format.')
        console.error('Import error:', error)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="d-flex gap-2">
      <button
        type="button"
        className="btn btn-sm btn-outline-primary"
        onClick={handleExport}
      >
        Export Flows
      </button>
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary"
        onClick={handleImport}
      >
        Import Flows
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  )
}

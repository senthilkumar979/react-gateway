import type { Scenario } from '@/types/Scenarios.types'
import { useRef } from 'react'
import { Button } from 'react-bootstrap'
import { IconExport } from '../../assets/IconExport'
import { IconImport } from '../../assets/IconImport'

interface ImportExportButtonsProps {
  scenarios: Scenario[]
  onImport: (scenarios: Scenario[]) => void
}

export const ImportExportButtons = ({
  scenarios,
  onImport,
}: ImportExportButtonsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const dataStr = JSON.stringify(scenarios, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `scenarios-${Date.now()}.json`
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
        const imported = JSON.parse(content) as Scenario[]
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
      <Button
        type="button"
        variant="outline-primary"
        onClick={handleImport}
        title="Import Scenarios"
      >
        <IconImport />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline-secondary"
        onClick={handleExport}
        title="Export Scenarios"
      >
        <IconExport />
      </Button>
    </div>
  )
}

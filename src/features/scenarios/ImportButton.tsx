import type { Scenario } from '@/types/Scenarios.types'
import { useRef } from 'react'
import { Button } from 'react-bootstrap'
import { IconImport } from '../../assets/IconImport'
import { useScenarios } from '../../context/ScenariosContext'

export const ImportButton = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addScenario } = useScenarios()

  const onImport = (imported: Scenario[]) => {
    imported.forEach((scenario) => {
      addScenario({
        name: scenario.name,
        description: scenario.description,
        requests: scenario.requests,
      })
    })
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
    <div className="d-flex gap-2 align-items-center">
      <Button
        type="button"
        size="sm"
        variant="outline-dark"
        onClick={handleImport}
        title="Import Scenarios"
      >
        <IconImport /> Import
      </Button>
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

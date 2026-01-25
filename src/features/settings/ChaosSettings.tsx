import { FormLabel } from '@/ui/FormLabel'
import { Button } from 'react-bootstrap'
import { IconBug } from '../../assets/IconBug'
import { useSettings } from '../../context/SettingsContext'

export const ChaosSettings = () => {
  const { updateSettings } = useSettings()

  const handleThrowErrorInComponent = () => {
    updateSettings({ chaos: true });
    setTimeout(() => {
      updateSettings({ chaos: false })
    }, 1000)
  }

  const handleThrowErrorInConsole = () => {
    throw new Error('Error in console')
  }

  return (
    <div>
      <div className="ps-1">
        <div className="mt-3 ps-3 border-start border-2 border-primary">
          <div className="d-flex align-items-center justify-content-between">
            <div className="flex-grow-1">
              <FormLabel
                isHideSpaceBelow
                description="Test error boundaries in your application by reading a non-existent property of an object inside a component render"
              >
                Throw Error in Component
              </FormLabel>
            </div>
            <div className="form-check form-switch ms-3">
              <Button
                size="sm"
                variant="outline-primary"
                onClick={handleThrowErrorInComponent}
              >
                <IconBug width={16} height={16} />
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-3 ps-3 border-start border-2 border-primary">
          <div className="d-flex align-items-center justify-content-between">
            <div className="flex-grow-1">
              <FormLabel
                isHideSpaceBelow
                description="Throw an error in your application by reading a non-existent property of an object inside a method"
              >
                Throw Error in console
              </FormLabel>
            </div>
            <div className="form-check form-switch ms-3">
              <Button
                size="sm"
                variant="outline-primary"
                onClick={handleThrowErrorInConsole}
              >
                <IconBug width={16} height={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

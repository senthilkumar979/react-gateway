import { IconBaseProps } from '../types/Icon.types'

export const IconEdit = ({
  width = 24,
  height = 24,
  className = '',
}: IconBaseProps) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 5-9 14-13z" />
    </svg>
  )
}

export interface Settings {
  position: 'left' | 'right'
  timeFreeze: {
    enabled: boolean
    frozenDate: string | null
  }
  timeOffset: {
    enabled: boolean
    offsetDays: number
  }
  chaos: boolean
}

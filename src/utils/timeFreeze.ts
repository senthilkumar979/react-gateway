import { addDays, parseISO } from 'date-fns'

let isFrozen = false
let frozenDate: Date | null = null
let offsetDays = 0
let isOffsetEnabled = false

const getAdjustedDate = (): Date => {
  let baseDate = new Date()

  if (isFrozen && frozenDate) {
    baseDate = frozenDate
  }

  if (isOffsetEnabled && offsetDays !== 0) {
    baseDate = addDays(baseDate, offsetDays)
  }

  return baseDate
}

export const freezeTime = (date: string | null): void => {
  if (date === null) {
    isFrozen = false
    frozenDate = null
    return
  }

  try {
    frozenDate = parseISO(date)
    isFrozen = true
  } catch (error) {
    console.error('Invalid date format for time freeze:', error)
  }
}

export const setTimeOffset = (enabled: boolean, days: number): void => {
  isOffsetEnabled = enabled
  offsetDays = days
}

export const initializeTimeManipulation = (): void => {
  if (typeof window === 'undefined') return

  const OriginalDate = window.Date

  class ManipulatedDate extends OriginalDate {
    constructor(...args: unknown[]) {
      if (args.length === 0) {
        super(getAdjustedDate().getTime())
      } else {
        super(...(args as [number | string | Date]))
      }
    }

    static now(): number {
      return getAdjustedDate().getTime()
    }
  }

  window.Date = ManipulatedDate as any
  Date.now = () => getAdjustedDate().getTime()
}

export const resetTimeManipulation = (): void => {
  if (typeof window === 'undefined') return
  window.Date = Date
}

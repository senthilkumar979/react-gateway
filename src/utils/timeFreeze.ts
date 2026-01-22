import { parseISO } from 'date-fns'

let isFrozen = false
let frozenDate: Date | null = null
let offsetDays = 0
let isOffsetEnabled = false
// Store reference to original Date constructor before any manipulation
const OriginalDateConstructor: typeof Date = (() => {
  if (typeof window !== 'undefined') {
    return window.Date
  }
  return Date
})()

const getAdjustedDate = (): Date => {
  let baseDate = new OriginalDateConstructor()

  if (isFrozen && frozenDate) {
    // Ensure we use the original Date constructor to avoid recursion
    baseDate = new OriginalDateConstructor(frozenDate.getTime())
  }

  if (isOffsetEnabled && offsetDays !== 0) {
    // Calculate offset using timestamp to avoid date-fns using manipulated Date
    const timestamp = baseDate.getTime()
    const offsetMs = offsetDays * 24 * 60 * 60 * 1000
    baseDate = new OriginalDateConstructor(timestamp + offsetMs)
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
    // parseISO might use Date internally, so we need to parse manually or
    // ensure we convert the result to use OriginalDateConstructor
    // Parse ISO string manually to avoid date-fns using manipulated Date
    const parsed = new OriginalDateConstructor(date)
    if (isNaN(parsed.getTime())) {
      // Fallback to parseISO if manual parsing fails
      const fallbackParsed = parseISO(date)
      frozenDate = new OriginalDateConstructor(fallbackParsed.getTime())
    } else {
      frozenDate = parsed
    }
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

  // OriginalDateConstructor is already set at module load time to the original Date
  // No need to reassign it here

  class ManipulatedDate extends OriginalDateConstructor {
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

  window.Date = ManipulatedDate as typeof Date
  Date.now = () => getAdjustedDate().getTime()
}

export const resetTimeManipulation = (): void => {
  if (typeof window === 'undefined') return
  window.Date = Date
}

export interface UIEvent {
  type: 'click' | 'input' | 'scroll'
  selector: string
  value?: string
  timestamp: number
}

export interface UIFlow {
  id: string
  name: string
  events: UIEvent[]
  createdAt: number
  updatedAt: number
}

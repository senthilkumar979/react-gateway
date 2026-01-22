export interface RequestConfig {
  name: string
  isActive: boolean
  url: string
  statusCode: string
  customResponse: string
  delayInMs: number
}

export interface Scenario {
  id: string
  name: string
  description: string
  requests: RequestConfig[]
  createdAt: number
  updatedAt: number
}

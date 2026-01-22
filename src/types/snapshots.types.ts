export interface Snapshot {
  id: string
  name: string
  localStorage: Record<string, string>
  sessionStorage: Record<string, string>
  cookies: string
  contextValues?: Record<string, unknown>
  createdAt: number
  updatedAt: number
}

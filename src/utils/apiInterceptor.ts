import type { Scenario, RequestConfig } from '@/types/Scenarios.types'

let originalFetch: typeof fetch
let originalAxios: any
let activeScenario: Scenario | null = null
let isIntercepting = false

const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const matchRequest = (url: string, pattern: string): boolean => {
  try {
    const regex = new RegExp(pattern)
    return regex.test(url)
  } catch {
    return url.includes(pattern)
  }
}

const findMatchingRequest = (url: string): RequestConfig | null => {
  if (!activeScenario) return null

  for (const request of activeScenario.requests) {
    if (request.isActive && matchRequest(url, request.url)) {
      return request
    }
  }

  return null
}

const createMockResponse = (requestConfig: RequestConfig): Response => {
  const status = parseInt(requestConfig.statusCode, 10) || 200
  let body: string

  try {
    JSON.parse(requestConfig.customResponse)
    body = requestConfig.customResponse
  } catch {
    body = requestConfig.customResponse
  }

  return new Response(body, {
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const startInterception = (scenario: Scenario | null): void => {
  activeScenario = scenario
  if (!scenario || isIntercepting) return

  isIntercepting = true

  if (typeof window !== 'undefined' && window.fetch) {
    originalFetch = window.fetch
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
      const matchingRequest = findMatchingRequest(url)

      if (matchingRequest) {
        if (matchingRequest.delayInMs > 0) {
          await delay(matchingRequest.delayInMs)
        }
        return createMockResponse(matchingRequest)
      }

      return originalFetch(input, init)
    }
  }

  if (typeof window !== 'undefined' && (window as any).axios) {
    const axios = (window as any).axios
    originalAxios = axios

    const originalRequest = axios.request || axios
    axios.request = function (config: any) {
      const matchingRequest = findMatchingRequest(config.url || '')

      if (matchingRequest) {
        return new Promise((resolve) => {
          setTimeout(() => {
            const status = parseInt(matchingRequest.statusCode, 10) || 200
            let data: any

            try {
              data = JSON.parse(matchingRequest.customResponse)
            } catch {
              data = matchingRequest.customResponse
            }

            resolve({
              data,
              status,
              statusText: status === 200 ? 'OK' : 'Error',
              headers: {},
              config,
            })
          }, matchingRequest.delayInMs)
        })
      }

      return originalRequest.call(this, config)
    }
  }
}

export const stopInterception = (): void => {
  if (!isIntercepting) return

  isIntercepting = false
  activeScenario = null

  if (typeof window !== 'undefined' && originalFetch) {
    window.fetch = originalFetch
  }

  if (typeof window !== 'undefined' && originalAxios) {
    const axios = (window as any).axios
    if (axios.request) {
      axios.request = originalAxios.request || originalAxios
    }
  }
}

import type { RequestConfig, Scenario } from '@/types/Scenarios.types'

interface AxiosRequestConfig {
  url?: string
  [key: string]: unknown
}

interface AxiosLike {
  request?(config: AxiosRequestConfig): Promise<unknown>
}

interface WindowWithAxios extends Window {
  axios?: AxiosLike
}

type AxiosRequestFn = (this: unknown, config: AxiosRequestConfig) => Promise<unknown>

let originalFetch: typeof fetch | undefined
let originalAxiosRequest: AxiosRequestFn | null = null
let activeScenario: Scenario | null = null
let isIntercepting = false

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

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

/**
 * Safely ensures a valid JSON string for `Response`. If the input is not valid JSON,
 * it will wrap it as a JSON-stringified string.
 * This prevents fetch().json() from throwing on invalid JSON.
 */
const ensureValidJsonString = (raw: string): string => {
  if (!raw || typeof raw !== 'string') return ''
  try {
    // Try to parse, will throw if not valid JSON
    JSON.parse(raw)
    return raw
  } catch {
    // Not valid JSON, return as a quoted JSON string value
    return JSON.stringify(raw)
  }
}

const createMockResponse = (requestConfig: RequestConfig): Response => {
  const status = parseInt(requestConfig.statusCode ?? '', 10) || 200
  // Ensure body is always valid JSON
  let body: string = ''
  if (typeof requestConfig.customResponseValue === 'string' && requestConfig.customResponseValue !== '') {
    body = ensureValidJsonString(requestConfig.customResponseValue)
  } else {
    body = ''
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

  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    if (!originalFetch) {
      originalFetch = window.fetch
    }
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      let url: string
      if (typeof input === 'string') {
        url = input
      } else if (input instanceof URL) {
        url = input.href
      } else {
        url = (input as Request).url
      }

      const matchingRequest = findMatchingRequest(url)
      if (
        matchingRequest &&
        (matchingRequest.statusCode !== '200' || matchingRequest.customResponseValue !== '')
      ) {
        if (
          typeof matchingRequest.delayInMs === 'number' &&
          matchingRequest.delayInMs > 0
        ) {
          await delay(matchingRequest.delayInMs)
        }
        return createMockResponse(matchingRequest)
      }
      return originalFetch!(input, init)
    }
  }

  // Axios mock
  const win = typeof window !== 'undefined' ? (window as WindowWithAxios) : null
  if (win?.axios) {
    const axios = win.axios
    const originalRequest = (axios.request ?? axios) as AxiosRequestFn
    originalAxiosRequest = originalRequest

    axios.request = function (config: AxiosRequestConfig) {
      const matchingRequest = findMatchingRequest(config.url ?? '')

      if (matchingRequest) {
        return new Promise((resolve) => {
          setTimeout(() => {
            const status =
              parseInt(matchingRequest.statusCode ?? '', 10) || 200
            let data: unknown

            if (
              typeof matchingRequest.customResponseValue === 'string' &&
              matchingRequest.customResponseValue !== ''
            ) {
              try {
                data = JSON.parse(matchingRequest.customResponseValue)
              } catch {
                // Fallback to the string, same as fetch
                data = matchingRequest.customResponseValue
              }
            } else {
              data = matchingRequest.customResponseValue
            }

            resolve({
              data,
              status,
              statusText: status === 200 ? 'OK' : 'Error',
              headers: {},
              config,
            })
          }, matchingRequest.delayInMs ?? 0)
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

  const win = typeof window !== 'undefined' ? (window as WindowWithAxios) : null
  if (win?.axios && originalAxiosRequest) {
    win.axios.request = originalAxiosRequest
    originalAxiosRequest = null
  }
}

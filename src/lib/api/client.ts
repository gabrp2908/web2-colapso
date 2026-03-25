import { getCsrfToken, clearCsrfToken, refreshCsrfToken } from './csrf'
import type { ApiResponse, TxPayload } from './types'

const BASE = '/api'

/**
 * Clase de error tipada para respuestas del backend.
 */
export class ApiError extends Error {
  constructor(
    public code: number,
    public override message: string,
    public alerts?: string[],
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Request genérico con CSRF automático y retry en caso de token inválido.
 */
async function request<T>(
  path: string,
  options: RequestInit & { _retry?: boolean } = {},
): Promise<ApiResponse<T>> {
  const csrf = await getCsrfToken()

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrf,
      ...(options.headers as Record<string, string>),
    },
  })

  const body = await res.json()

  if (!res.ok) {
    // CSRF expirado → refrescar y reintentar una vez
    if (res.status === 403 && !options._retry) {
      clearCsrfToken()
      await refreshCsrfToken()
      return request<T>(path, { ...options, _retry: true })
    }
    throw new ApiError(body.code ?? res.status, body.msg ?? 'Error', body.alerts)
  }

  return body as ApiResponse<T>
}

/** Despachar transacción al endpoint /toProccess */
export async function dispatch<T = unknown>(
  tx: number,
  params?: Record<string, unknown>,
): Promise<ApiResponse<T>> {
  const payload: TxPayload = { tx, params }
  return request<T>('/toProccess', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/** POST genérico (para /login, /logout) */
export async function post<T = unknown>(
  path: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  return request<T>(path, {
    method: 'POST',
    body: body != null ? JSON.stringify(body) : undefined,
  })
}

/** GET genérico */
export async function get<T = unknown>(path: string): Promise<ApiResponse<T>> {
  return request<T>(path, { method: 'GET' })
}

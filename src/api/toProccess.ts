import { axiosClient } from './axios-client'

export interface TxRequest<TParams = unknown> {
  tx: number
  params?: TParams
}

export interface TxResponse<T = unknown> {
  code: number
  msg: string
  data?: T
}

export class TxError extends Error {
  constructor(
    message: string,
    public code: number,
    public details?: object
  ) {
    super(message)
    this.name = 'TxError'
  }
}

export async function execute<T = unknown>(
  tx: number,
  params?: Record<string, unknown>
): Promise<T> {
  try {
    const request: TxRequest = { tx, params }
    const response = await axiosClient.post<TxResponse<T>>('/toProccess', request)

    if (response.code >= 400) {
      throw new TxError(response.msg, response.code, response)
    }

    return response.data as T
  } catch (error: unknown) {
    if (error instanceof TxError) {
      throw error
    }

    const axiosError = error as {
      response?: { data?: TxResponse }
      message?: string
    }

    if (axiosError.response?.data) {
      const { code, msg } = axiosError.response.data
      throw new TxError(msg || 'Transaction failed', code || 500)
    }

    throw new TxError(
      axiosError.message || 'Network error',
      (error as { status?: number }).status || 0
    )
  }
}

export async function getCsrfToken(): Promise<string | null> {
  try {
    await axiosClient.get<{ token: string }>('/csrf')
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith('csrf_token='))
      ?.split('=')[1] || null
  } catch {
    return null
  }
}

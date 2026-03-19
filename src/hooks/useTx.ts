import { useState, useCallback } from 'react'
import { execute, TxError } from '@/api/toProccess'

export interface UseTxState<T> {
  data: T | null
  loading: boolean
  error: string | null
  executeTx: (params?: Record<string, unknown>) => Promise<T | undefined>
  reset: () => void
}

export function useTx<T = unknown>(txId: number): UseTxState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeTx = useCallback(
    async (params: Record<string, unknown> = {}): Promise<T | undefined> => {
      setLoading(true)
      setError(null)

      try {
        const result = await execute<T>(txId, params)
        setData(result)
        return result
      } catch (err: unknown) {
        const message =
          err instanceof TxError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'An unexpected error occurred'
        setError(message)
        return undefined
      } finally {
        setLoading(false)
      }
    },
    [txId]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, executeTx, reset }
}

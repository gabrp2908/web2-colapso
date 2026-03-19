import { useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'

export function useAuthActions() {
  const { login: authLogin, logout: authLogout, user, isAuthenticated } = useAuth()

  const login = useCallback(
    async (identifier: string, password: string) => {
      await authLogin({ identifier, password })
    },
    [authLogin]
  )

  const logout = useCallback(async () => {
    await authLogout()
  }, [authLogout])

  return {
    user,
    isAuthenticated,
    login,
    logout,
  }
}

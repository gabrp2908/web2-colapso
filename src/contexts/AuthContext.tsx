import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import * as authService from '@/lib/api/services/auth'
import { ApiError } from '@/lib/api/client'
import type { SessionInfo, NavigationResponse, MenuStructure } from '@/lib/api/types'

// ── Tipos públicos ──────────────────────────────────

export interface AuthUser {
  userId: number
  username: string | null
  email: string | null
  profileIds: number[]
  activeProfileId: number | null
}

interface AuthContextType {
  user: AuthUser | null
  navigation: MenuStructure
  loading: boolean
  login: (identifier: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (data: RegisterParams) => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  verifyPasswordReset: (code: string) => Promise<void>
  resetPassword: (code: string, newPassword: string) => Promise<void>
  requestUsername: (email: string) => Promise<void>
  checkSession: () => Promise<void>
}

export interface RegisterParams {
  email: string
  password: string
  user_na?: string
  person_ci?: string
  person_na?: string
  person_ln?: string
  person_ph?: string
  person_deg?: string
}

const AuthContext = createContext<AuthContextType | null>(null)

// ── Provider ────────────────────────────────────────

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [navigation, setNavigation] = useState<MenuStructure>([])
  const [loading, setLoading] = useState(true)

  const applyNavigation = useCallback((data: NavigationResponse) => {
    const { session, navigation: nav } = data
    setUser({
      userId: session.userId,
      username: session.username,
      email: session.email,
      profileIds: session.profileIds,
      activeProfileId: session.activeProfileId,
    })
    setNavigation(nav)
  }, [])

  const clearState = useCallback(() => {
    setUser(null)
    setNavigation([])
  }, [])

  /** Intenta restaurar sesión existente (al montar o refrescar) */
  const checkSession = useCallback(async () => {
    try {
      setLoading(true)
      const res = await authService.getNavigation()
      if (res.data) {
        applyNavigation(res.data)
      }
    } catch {
      clearState()
    } finally {
      setLoading(false)
    }
  }, [applyNavigation, clearState])

  /** Al montar, verificar si hay sesión activa */
  useEffect(() => {
    checkSession()
  }, [checkSession])

  const login = async (identifier: string, password: string) => {
    await authService.login(identifier, password)
    const navRes = await authService.getNavigation()
    if (navRes.data) {
      applyNavigation(navRes.data)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      clearState()
    }
  }

  const register = async (data: RegisterParams) => {
    await authService.register(data)
  }

  const requestPasswordReset = async (email: string) => {
    await authService.requestPasswordReset(email)
  }

  const verifyPasswordReset = async (code: string) => {
    await authService.verifyPasswordReset(code)
  }

  const resetPassword = async (code: string, newPassword: string) => {
    await authService.resetPassword(code, newPassword)
  }

  const requestUsername = async (email: string) => {
    await authService.requestUsername(email)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        navigation,
        loading,
        login,
        logout,
        register,
        requestPasswordReset,
        verifyPasswordReset,
        resetPassword,
        requestUsername,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

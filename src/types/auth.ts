export interface User {
  user_id: number
  user_em: string
  user_na?: string
  user_act: boolean
  user_created_dt: Date
  user_updated_dt?: Date
  user_last_login_dt?: Date | null
  user_em_verified_dt?: Date | null
  user_sol?: boolean
  person_id?: number | null
}

export interface UserSummary {
  user_id: number
  user_em: string
  name?: string
  user_act: boolean
}

export interface Session {
  sessionId: string
  userId: number
  token: string
  expiresAt: Date
  createdAt: Date
}

export interface LoginCredentials {
  identifier: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name?: string
}

export interface AuthState {
  user: UserSummary | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

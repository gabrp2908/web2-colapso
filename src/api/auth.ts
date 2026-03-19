import { axiosClient } from './axios-client'
import type { UserSummary, Session } from '@/types/auth'

export interface LoginRequest {
  identifier: string
  password: string
}

export interface LoginResponse {
  user: UserSummary
  session: Session
}

export interface LogoutResponse {
  success: boolean
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await axiosClient.post<LoginResponse>('/login', credentials)
  return response
}

export async function logout(sessionId?: string): Promise<LogoutResponse> {
  const response = await axiosClient.post<LogoutResponse>('/logout', { sessionId })
  return response
}

export async function checkSession(): Promise<LoginResponse | null> {
  try {
    const response = await axiosClient.get<LoginResponse>('/api/session')
    return response
  } catch {
    return null
  }
}

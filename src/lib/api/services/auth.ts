import { post, dispatch } from '../client'
import { TX } from '../tx-registry'
import { clearCsrfToken } from '../csrf'
import type { ApiResponse, NavigationResponse } from '../types'

/** Login: POST /login con {identifier, password} */
export async function login(identifier: string, password: string): Promise<ApiResponse> {
  return post('/login', { identifier, password })
}

/** Logout: POST /logout + limpiar CSRF */
export async function logout(): Promise<ApiResponse> {
  const result = await post('/logout')
  clearCsrfToken()
  return result
}

/** Registro: tx Auth.register */
export async function register(params: {
  email: string
  password: string
  user_na?: string
  person_ci?: string
  person_na?: string
  person_ln?: string
  person_ph?: string
  person_deg?: string
}): Promise<ApiResponse> {
  return dispatch(TX.AUTH_REGISTER, params)
}

/** Solicitar reset de password por email */
export async function requestPasswordReset(email: string): Promise<ApiResponse> {
  return dispatch(TX.AUTH_REQUEST_PASSWORD_RESET, { email })
}

/** Verificar código de reset */
export async function verifyPasswordReset(code: string): Promise<ApiResponse> {
  return dispatch(TX.AUTH_VERIFY_PASSWORD_RESET, { code })
}

/** Confirmar nueva password con código */
export async function resetPassword(code: string, newPassword: string): Promise<ApiResponse> {
  return dispatch(TX.AUTH_RESET_PASSWORD, { code, newPassword })
}

/** Solicitar username por email */
export async function requestUsername(email: string): Promise<ApiResponse> {
  return dispatch(TX.AUTH_REQUEST_USERNAME, { email })
}

/** Obtener navegación dinámica (session + menú) */
export async function getNavigation(): Promise<ApiResponse<NavigationResponse>> {
  return dispatch<NavigationResponse>(TX.AUTH_GET_NAVIGATION, {})
}

/** Cambiar perfil activo */
export async function switchActiveProfile(profileId: number): Promise<ApiResponse> {
  return dispatch(TX.AUTH_SWITCH_PROFILE, { profileId })
}

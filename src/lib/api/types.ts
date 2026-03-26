/** Envelope de respuesta estándar del backend Toproc */
export interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data?: T
  alerts?: string[]
}

/** Payload que envía el frontend al endpoint /toProccess */
export interface TxPayload {
  tx: number
  params?: Record<string, unknown>
}

/** Datos de sesión del usuario (viene en NavigationResponse) */
export interface SessionInfo {
  userId: number
  username: string | null
  email: string | null
  profileIds: number[]
  activeProfileId: number | null
  mode: 'active' | 'union'
  effectiveProfileIds: number[]
  profiles?: { id: number; profile_na: string }[]
}

// ── Estructura de Navegación (espejo de security.ts del backend) ────

/** Opción individual dentro de un menú */
export interface SecurityOption {
  option_id: number
  option_na: string
  method_id?: number
  is_accessible?: boolean
}

/** Menú dentro de un subsistema */
export interface SecurityMenu {
  menu_id: number
  menu_na: string
  subsystem_id: number
  options?: SecurityOption[]
}

/** Subsistema de la navegación (contenedor de menús) */
export interface SecuritySubsystem {
  subsystem_id: number
  subsystem_na: string
  menus?: SecurityMenu[]
}

/** Estructura completa de navegación */
export type MenuStructure = SecuritySubsystem[]

/** Respuesta combinada de sesión + navegación */
export interface NavigationResponse {
  session: SessionInfo
  navigation: MenuStructure
}

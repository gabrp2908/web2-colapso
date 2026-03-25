/**
 * Manager de token CSRF.
 * Obtiene el token de GET /csrf y lo cachea en memoria.
 * Se refresca automáticamente si el cliente lo invalida.
 */
let csrfToken: string | null = null

export async function getCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken
  return refreshCsrfToken()
}

export async function refreshCsrfToken(): Promise<string> {
  const res = await fetch('/api/csrf', { credentials: 'include' })
  if (!res.ok) throw new Error('No se pudo obtener token CSRF')
  const data = await res.json()
  csrfToken = data.csrfToken
  return csrfToken!
}

export function clearCsrfToken(): void {
  csrfToken = null
}

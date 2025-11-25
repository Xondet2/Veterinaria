export const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'

export async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
  const headers = new Headers(options.headers ?? {})
  const method = (options.method || 'GET').toUpperCase()
  const hasBody = options.body != null
  if (!headers.has('Content-Type') && hasBody && method !== 'GET') headers.set('Content-Type', 'application/json')
  if (!headers.has('Accept')) headers.set('Accept', 'application/json')
  let res: Response
  try {
    res = await fetch(`${API}${path}`, { ...options, headers })
  } catch (e: any) {
    const err: any = new Error(e?.message || 'Falló la conexión con el API')
    err.status = 0
    err.data = null
    throw err
  }
  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await res.json() : await res.text()
  if (!res.ok) {
    const msg = isJson ? (data as any)?.error || JSON.stringify(data) : String(data)
    const err: any = new Error(msg || `Error ${res.status}`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export function parseJwt(_token: string) { return null }

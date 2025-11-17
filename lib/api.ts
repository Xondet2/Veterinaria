export const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'

export async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const headers = new Headers(options.headers ?? {})
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const res = await fetch(`${API}${path}`, { ...options, headers })
  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await res.json() : await res.text()
  if (!res.ok) {
    if (typeof window !== 'undefined' && (res.status === 401 || res.status === 403)) {
      try { localStorage.removeItem('token'); localStorage.removeItem('usuario') } catch {}
      window.location.href = '/login'
    }
    const msg = isJson ? (data as any)?.error || JSON.stringify(data) : String(data)
    throw new Error(msg || `Error ${res.status}`)
  }
  return data
}

export function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}
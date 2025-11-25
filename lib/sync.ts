export function connectSync(onEvent: (name: string, data: any) => void) {
  if (typeof window === 'undefined') return () => {}
  const es = new EventSource(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'}/api/sync/stream`)
  const names = ['mascotas:created','mascotas:deleted','certificados:created','usuarios:created']
  names.forEach(n => es.addEventListener(n, (ev: MessageEvent) => {
    try { const data = JSON.parse(ev.data); onEvent(n, data) } catch { onEvent(n, ev.data) }
  }))
  es.onerror = () => {}
  return () => { es.close() }
}
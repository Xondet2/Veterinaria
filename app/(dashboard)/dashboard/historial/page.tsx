"use client"

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'

type Historial = { id: string; fecha: string; descripcion: string; diagnostico?: string; tratamiento?: string; mascota: { id: string; nombre: string } }

export default function HistorialPage() {
  const [data, setData] = useState<Historial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rol, setRol] = useState<string>('dueño')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try { const res = await apiFetch('/api/historial', { method: 'GET' }); if (mounted) setData(res?.data ?? []) }
      catch (err: any) { setError(err?.message || 'Error al cargar historial') }
      finally { setLoading(false) }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    try { const u = localStorage.getItem('usuario'); const user = u ? JSON.parse(u) : null; setRol(user?.rol ?? 'dueño') } catch { setRol('dueño') }
  }, [])

  if (loading) return <p>Cargando historial...</p>
  if (error) return <p className="text-destructive">{error}</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Historial Médico</h2>
        {(rol === 'admin' || rol === 'veterinario') && (
          <a href="/dashboard/historial/nuevo" className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted/30">Nuevo registro</a>
        )}
      </div>
      <div className="grid gap-4">
        {data.map(h => (
          <div key={h.id} className="rounded-lg border p-4">
            <p className="font-medium">{h.mascota?.nombre ?? 'Mascota'}</p>
            <p className="text-sm text-muted-foreground">{new Date(h.fecha).toLocaleDateString('es-ES')}</p>
            <p className="text-sm">{h.descripcion}</p>
            {h.diagnostico && (<p className="text-xs">Dx: {h.diagnostico}</p>)}
            {h.tratamiento && (<p className="text-xs">Tx: {h.tratamiento}</p>)}
          </div>
        ))}
        {data.length === 0 && (
          <div className="rounded-lg border p-4"><p className="text-sm text-muted-foreground">No hay registros</p></div>
        )}
      </div>
    </div>
  )
}
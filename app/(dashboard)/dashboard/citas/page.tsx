'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'

type Cita = {
  id: string
  mascota: { id: string; nombre: string }
  veterinario: { id: string; nombre: string; apellido: string }
  fechaHoraInicio: string
  duracionMinutos: number
  motivo: string
  estado: string
}

export default function CitasPage() {
  const [data, setData] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rol, setRol] = useState<string>('dueño')
  const formatter = new Intl.DateTimeFormat('es-ES', { timeZone: 'UTC', dateStyle: 'short', timeStyle: 'short' })

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await apiFetch('/api/citas', { method: 'GET' })
        if (mounted) setData(res?.data ?? [])
      } catch (err: any) {
        setError(err?.message || 'Error al cargar citas')
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    try { const u = localStorage.getItem('usuario'); const user = u ? JSON.parse(u) : null; setRol(user?.rol ?? 'dueño') } catch { setRol('dueño') }
  }, [])

  if (loading) return <p>Cargando citas...</p>
  if (error) return <p className="text-destructive">{error}</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Citas</h2>
        {(rol === 'admin' || rol === 'veterinario' || rol === 'dueño') && (
          <a href="/dashboard/citas/nueva" className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted/30">Agendar cita</a>
        )}
      </div>
      <div className="grid gap-4">
        {data.map((c) => (
          <div key={c.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">{c.mascota?.nombre ?? 'Mascota'}</p>
              <span className="text-xs rounded bg-muted px-2 py-1 capitalize">{c.estado}</span>
            </div>
            <p className="text-sm text-muted-foreground">Vet: {c.veterinario?.nombre} {c.veterinario?.apellido}</p>
            <p className="text-sm text-muted-foreground">Inicio: {formatter.format(new Date(c.fechaHoraInicio))}</p>
            <p className="text-sm text-muted-foreground">Duración: {c.duracionMinutos} min</p>
            <p className="text-sm">Motivo: {c.motivo}</p>
          </div>
        ))}
        {data.length === 0 && (
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">No hay citas registradas</p>
          </div>
        )}
      </div>
    </div>
  )
}
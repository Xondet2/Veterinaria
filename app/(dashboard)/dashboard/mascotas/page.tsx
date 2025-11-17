'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/lib/api'

type Mascota = { id: string; nombre: string; especie: string; raza: string; edadAños: number; pesoKg: number; sexo: string; microchip?: string }

export default function MascotasPage() {
  const [data, setData] = useState<Mascota[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rol, setRol] = useState<string>('dueño')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await apiFetch('/api/mascotas', { method: 'GET' })
        if (mounted) setData(res?.data ?? [])
      } catch (err: any) {
        setError(err?.message || 'Error al cargar mascotas')
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    try {
      const u = localStorage.getItem('usuario')
      const user = u ? JSON.parse(u) : null
      setRol(user?.rol ?? 'dueño')
    } catch { setRol('dueño') }
  }, [])

  if (loading) return <p>Cargando mascotas...</p>
  if (error) return <p className="text-destructive">{error}</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Mascotas</h2>
        {(rol === 'admin' || rol === 'veterinario') && (
          <a href="/dashboard/mascotas/nueva" className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted/30">Nueva mascota</a>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((m) => (
          <div key={m.id} className="rounded-lg border p-4 space-y-1">
            <p className="font-medium">{m.nombre}</p>
            <p className="text-sm text-muted-foreground">{m.especie} • {m.raza} • {m.sexo}</p>
            <p className="text-xs text-muted-foreground">Edad: {m.edadAños} años • Peso: {m.pesoKg} kg</p>
            {m.microchip && (<p className="text-xs text-muted-foreground">Microchip: {m.microchip}</p>)}
          </div>
        ))}
        {data.length === 0 && (
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">No hay mascotas registradas</p>
          </div>
        )}
      </div>
    </div>
  )
}
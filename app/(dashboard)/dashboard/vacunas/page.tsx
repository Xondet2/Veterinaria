"use client"

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'

type Vacuna = { id: string; nombre: string; fechaAplicacion: string; dosis?: string; lote?: string; proximaFecha?: string; mascota: { id: string; nombre: string } }

export default function VacunasPage() {
  const [data, setData] = useState<Vacuna[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rol, setRol] = useState<string>('dueño')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try { const res = await apiFetch('/api/vacunas', { method: 'GET' }); if (mounted) setData(res?.data ?? []) }
      catch (err: any) { setError(err?.message || 'Error al cargar vacunas') }
      finally { setLoading(false) }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    try { const u = localStorage.getItem('usuario'); const user = u ? JSON.parse(u) : null; setRol(user?.rol ?? 'dueño') } catch { setRol('dueño') }
  }, [])

  if (loading) return <p>Cargando vacunas...</p>
  if (error) return <p className="text-destructive">{error}</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Vacunas</h2>
        {(rol === 'admin' || rol === 'veterinario') && (
          <a href="/dashboard/vacunas/nueva" className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted/30">Registrar vacuna</a>
        )}
      </div>
      <div className="grid gap-4">
        {data.map(v => (
          <div key={v.id} className="rounded-lg border p-4">
            <p className="font-medium">{v.mascota?.nombre ?? 'Mascota'}</p>
            <p className="text-sm">{v.nombre}</p>
            <p className="text-sm text-muted-foreground">Aplicada: {new Date(v.fechaAplicacion).toLocaleDateString('es-ES')}</p>
            {v.proximaFecha && (<p className="text-xs text-muted-foreground">Próxima: {new Date(v.proximaFecha).toLocaleDateString('es-ES')}</p>)}
          </div>
        ))}
        {data.length === 0 && (
          <div className="rounded-lg border p-4"><p className="text-sm text-muted-foreground">No hay vacunas registradas</p></div>
        )}
      </div>
    </div>
  )
}
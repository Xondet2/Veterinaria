"use client"

import { useEffect, useState } from 'react'

import { apiFetch } from '@/lib/api'

type Certificado = { id: string; tipo: string; descripcion: string; fechaEmision: string; mascota: { id: string; nombre: string } }

export default function CertificadosPage() {
  const [data, setData] = useState<Certificado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rol, setRol] = useState<string>('dueño')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try { const res = await apiFetch('/api/certificados', { method: 'GET' }); if (mounted) setData(res?.data ?? []) }
      catch (err: any) { setError(err?.message || 'Error al cargar certificados') }
      finally { setLoading(false) }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    try { const u = localStorage.getItem('usuario'); const user = u ? JSON.parse(u) : null; setRol(user?.rol ?? 'dueño') } catch { setRol('dueño') }
  }, [])

  if (loading) return <p>Cargando certificados...</p>
  if (error) return <p className="text-destructive">{error}</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Certificados</h2>
        {(rol === 'admin' || rol === 'veterinario') && (
          <a href="/dashboard/certificados/nuevo" className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted/30">Nuevo certificado</a>
        )}
      </div>
      <div className="grid gap-4">
        {data.map(c => (
          <div key={c.id} className="rounded-lg border p-4">
            <p className="font-medium">{c.mascota?.nombre ?? 'Mascota'}</p>
            <p className="text-sm text-muted-foreground capitalize">Tipo: {c.tipo}</p>
            <p className="text-sm">{c.descripcion}</p>
            <p className="text-xs text-muted-foreground">Emitido: {new Date(c.fechaEmision).toLocaleDateString('es-ES')}</p>
          </div>
        ))}
        {data.length === 0 && (
          <div className="rounded-lg border p-4"><p className="text-sm text-muted-foreground">No hay certificados</p></div>
        )}
      </div>
    </div>
  )
}
"use client"

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'

type Historial = { id: string; fecha: string; descripcion: string; diagnostico?: string; tratamiento?: string; mascota: { id: string; nombre: string } }

export default function HistorialPage() {
  const [data, setData] = useState<Historial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rol, setRol] = useState<string>('dueño')
  const [banner, setBanner] = useState<string>('')

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

  useEffect(() => {
    try {
      const images = [
        '/administracion-clinica-veterinaria-1.jpg',
        '/ragdoll-kitten-at-veterinerian-clinic-2023-02-02-03-50-48-utc.jpg',
        '/mejorar-comunicacion-duenos-mascotas-veterinaria.jpg',
        '/2022_10_06_11_59_27_000000_169-Medicina-Veterin--ria---1920-x-1080.jpg',
        '/Cardiopatia-en-Perros-y-Gatos.webp',
      ]
      const key = '/dashboard/historial'
      const usedRaw = sessionStorage.getItem('usedImages')
      const mapRaw = sessionStorage.getItem('imageMap')
      const used: string[] = usedRaw ? JSON.parse(usedRaw) : []
      const map: Record<string, string> = mapRaw ? JSON.parse(mapRaw) : {}
      if (!map[key]) {
        let choices = images.filter((src) => !used.includes(src))
        if (choices.length === 0) { choices = images; used.length = 0 }
        const selected = choices[Math.floor(Math.random() * choices.length)]
        map[key] = selected
        used.push(selected)
        sessionStorage.setItem('usedImages', JSON.stringify(used))
        sessionStorage.setItem('imageMap', JSON.stringify(map))
      }
      setBanner(map[key])
    } catch { setBanner('/2022_10_06_11_59_27_000000_169-Medicina-Veterin--ria---1920-x-1080.jpg') }
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
      <div className="rounded-lg border p-4">
        <img src={banner || '/2022_10_06_11_59_27_000000_169-Medicina-Veterin--ria---1920-x-1080.jpg'} alt="Historial médico" className="w-full h-auto max-h-64 sm:max-h-80 object-cover rounded-md" />
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
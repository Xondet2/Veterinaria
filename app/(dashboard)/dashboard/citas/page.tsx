'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { useI18n } from '@/lib/i18n'

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
  const { t, lang } = useI18n()
  const formatter = new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'es-ES', { timeZone: 'UTC', dateStyle: 'short', timeStyle: 'short' })
  const [banner, setBanner] = useState<string>('')

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

  useEffect(() => {
    try {
      const images = [
        '/administracion-clinica-veterinaria-1.jpg',
        '/ragdoll-kitten-at-veterinerian-clinic-2023-02-02-03-50-48-utc.jpg',
        '/mejorar-comunicacion-duenos-mascotas-veterinaria.jpg',
        '/2022_10_06_11_59_27_000000_169-Medicina-Veterin--ria---1920-x-1080.jpg',
        '/Cardiopatia-en-Perros-y-Gatos.webp',
      ]
      const key = '/dashboard/citas'
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
    } catch { setBanner('/mejorar-comunicacion-duenos-mascotas-veterinaria.jpg') }
  }, [])

  if (loading) return <p>{t('citas.loading')}</p>
  if (error) return <p className="text-destructive">{error}</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('citas.title')}</h2>
        {(rol === 'admin' || rol === 'veterinario' || rol === 'dueño') && (
          <a href="/dashboard/citas/nueva" className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted/30">{t('citas.new')}</a>
        )}
      </div>
      <div className="rounded-lg border p-4">
        <img src={banner || '/mejorar-comunicacion-duenos-mascotas-veterinaria.jpg'} alt="Comunicación con dueños" className="w-full h-auto max-h-64 sm:max-h-80 object-cover rounded-md" />
      </div>
      <div className="grid gap-4">
        {data.map((c) => (
          <div key={c.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">{c.mascota?.nombre ?? 'Mascota'}</p>
              <span className="text-xs rounded bg-muted px-2 py-1 capitalize">{c.estado}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t('citas.vet')}: {c.veterinario?.nombre} {c.veterinario?.apellido}</p>
            <p className="text-sm text-muted-foreground">{t('citas.start')}: {formatter.format(new Date(c.fechaHoraInicio))}</p>
            <p className="text-sm text-muted-foreground">{t('citas.duration')}: {c.duracionMinutos} {t('citas.minutes')}</p>
            <p className="text-sm">{t('citas.reason')}: {c.motivo}</p>
          </div>
        ))}
        {data.length === 0 && (
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">{t('citas.none')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
